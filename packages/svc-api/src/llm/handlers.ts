import { OpenAI } from "openai";
import axios from "axios";

export interface LLMResponse {
  content: string;
}

export interface LLMHandler {
  generateCompletion(messages: any[]): Promise<LLMResponse>;
}

export class OpenAIHandler implements LLMHandler {
  private client: OpenAI;

  constructor(apiKey: string) {
    this.client = new OpenAI({ apiKey });
  }

  async generateCompletion(messages: any[]): Promise<LLMResponse> {
    const completion = await this.client.chat.completions.create({
      messages,
      model: "gpt-3.5-turbo",
    });

    return {
      content: completion.choices[0].message.content || "",
    };
  }
}

export class PhalaHandler implements LLMHandler {
  private apiUrl: string;

  constructor(
    apiUrl: string = "https://inference-api.phala.network/v1/chat/completions"
  ) {
    this.apiUrl = apiUrl;
  }

  async generateCompletion(messages: any[]): Promise<LLMResponse> {
    const response = await axios.post(
      this.apiUrl,
      {
        messages,
        stream: false,
        model: "meta-llama/meta-llama-3.1-8b-instruct",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    return {
      content: response.data.choices[0].message.content,
    };
  }
}

export function createLLMHandler(): LLMHandler {
  const llmProvider = process.env.LLM_PROVIDER?.toLowerCase() || "openai";

  switch (llmProvider) {
    case "phala":
      return new PhalaHandler();
    case "openai":
      return new OpenAIHandler(process.env.OPENAI_API_KEY!);
    default:
      throw new Error(`Unsupported LLM provider: ${llmProvider}`);
  }
}
