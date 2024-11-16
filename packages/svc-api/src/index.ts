import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {
  createPublicClient,
  createWalletClient,
  encodePacked,
  http,
  keccak256,
  encodeAbiParameters,
  parseAbiParameters,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { foundry } from "viem/chains";
import IWorldAbi from "../../contracts/out/IWorld.sol/IWorld.abi.json";
import Deploy from "../../contracts/deploys/31337/latest.json";
import { createLLMHandler } from "./llm/handlers";
import Replicate from "replicate";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const WORLD_ADDRESS = Deploy.worldAddress as `0x${string}`;

// Initialize Viem clients
const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

const publicClient = createPublicClient({
  chain: foundry,
  transport: http(),
  pollingInterval: 1000,
});

const walletClient = createWalletClient({
  account,
  chain: foundry,
  transport: http(),
});

const llmHandler = createLLMHandler();

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

function encodeComponentValue(name: string, value: string): `0x${string}` {
  // Handle numeric values (like DrunkenModifier)
  if (name === "DrunkenModifier") {
    return encodeAbiParameters(parseAbiParameters("uint256"), [BigInt(value)]);
  }

  // Handle CapturableAbility by encoding it as an ABI-encoded string
  if (name === "CapturableAbility") {
    return encodeAbiParameters(parseAbiParameters("string"), [value]);
  }

  // Handle other string values
  return ("0x" + Buffer.from(value).toString("hex")) as `0x${string}`;
}

app.post("/generate-piece", async (req, res) => {
  try {
    const completion = await llmHandler.generateCompletion([
      {
        role: "system",
        content: `You are a helpful assistant that generates chess piece variations.
        
        You must provide movementAbility and captureAbility as strings. Notation is as follows: 

        n = north, s = south, e = east, w = west
        # = number of squares maximum to move
        * = unlimited movement

        Pawn:
        movementAbility: "n1", 
        captureAbility: "n1e1,n1w1",

        Queen:
        movementAbility: "n*,s*,e*,w*,n*e*,n*w*,s*e*,s*w*"
        captureAbility: ""

        Additionally, you have access to the following *components*:
        CapturableAbility
        DrunkenModifier

        CapturableAbility indicates where a piece that can capture this piece is able to capture it from. Use the same notation as movementAbility.
        DrunkenModifier indicates a percentage chance that this piece will fail to capture, or fail to be captured. It should be an integer between 0 and 100. JUST AN INTEGER.

        Generate a unique chess piece and return the piece as a JSON object with the following fields:
        name: string
        movementAbility: string
        captureAbility: string
        components: {name: string, value: string}[]
        
        Return only the JSON object, nothing else.
        You do not have to use all components, and you can use none at all.`,
      },
      {
        role: "user",
        content: req.body.prompt || "Generate a unique cool custom chess piece",
      },
    ]);

    const aiResponse = completion.content;
    console.log(aiResponse);
    const pieceData = JSON.parse(aiResponse as string);

    // Properly encode component values
    const encodedComponents = pieceData.components.map(
      (component: { name: string; value: string }) => ({
        name: component.name,
        value: encodeComponentValue(component.name, component.value),
      })
    );

    const args = [
      pieceData.name,
      pieceData.movementAbility,
      pieceData.captureAbility,
      encodedComponents,
    ];

    const { request } = await publicClient.simulateContract({
      address: WORLD_ADDRESS,
      abi: IWorldAbi,
      functionName: "app__createPiece",
      // @ts-ignore
      args,
      account,
    });

    const txHash = await walletClient.writeContract(request);
    await publicClient.waitForTransactionReceipt({ hash: txHash });

    console.log("Tx hash 1:", txHash);

    // 3. Give piece to player
    const pieceId = keccak256(
      encodePacked(["string"], [pieceData.name])
    ) as `0x${string}`;

    const { request: request2 } = await publicClient.simulateContract({
      address: WORLD_ADDRESS,
      abi: IWorldAbi,
      functionName: "app__givePieceToPlayer",
      args: [req.body.destinationAddress || account.address, pieceId, 1n],
      account,
    });

    const tx2Hash = await walletClient.writeContract(request2);
    await publicClient.waitForTransactionReceipt({ hash: tx2Hash });

    console.log("Tx hash 2:", tx2Hash);

    // Generate image using Replicate
    const imagePrompt = `A creative chess piece named ${pieceData.name}, artistic style, detailed, professional product photography`;
    const output = await replicate.run(
      "bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637",
      {
        input: {
          prompt: imagePrompt,
          num_outputs: 1,
        },
      }
    );

    // Properly handles both array and single string responses
    const imageUrl = Array.isArray(output) ? output[0] : output;
    console.log("Image URL:", imageUrl);

    res.json({
      aiResponse: aiResponse,
      pieceId,
      transactionHash: txHash,
      givePieceTransactionHash: tx2Hash,
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
