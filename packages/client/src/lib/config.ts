import { Chain } from "viem";
import { mainnet, garnet, baseSepolia, base } from "viem/chains";

export const envs = {
  dynamicEnvironmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
  activeChain: import.meta.env.VITE_ACTIVE_CHAIN || "mainnet",
  showDevTools: import.meta.env.VITE_SHOW_DEV_TOOLS || false,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
};

export const anvilChain: Chain = {
  id: 31337,
  name: "Anvil",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
  blockExplorers: {
    default: { name: "Local Explorer", url: "http://localhost:8545" },
  },
  testnet: true,
};

const chains: Record<string, Chain> = {
  mainnet,
  garnet,
  baseSepolia,
  anvil: anvilChain,
};

export const evmNetworks = [
  {
    blockExplorerUrls: ["http://localhost:8545"],
    chainId: anvilChain.id,
    chainName: anvilChain.name,
    iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
    name: "Anvil Local",
    nativeCurrency: {
      ...anvilChain.nativeCurrency,
      iconUrl: "https://app.dynamic.xyz/assets/networks/eth.svg",
    },
    networkId: anvilChain.id,
    rpcUrls: [anvilChain.rpcUrls.default.http[0]],
    vanityName: "Anvil Local",
  },
  {
    blockExplorerUrls: ["https://explorer.garnetchain.com"],
    chainId: 17069,
    chainName: "Garnet Holesky",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/eth.svg"],
    name: "Garnet Holesky",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      iconUrl: "https://app.dynamic.xyz/assets/networks/eth.svg",
    },
    networkId: 17069,
    rpcUrls: ["https://rpc.garnetchain.com"],
    vanityName: "Garnet Holesky (L2)",
  },
  {
    blockExplorerUrls: ["https://base-sepolia.blockscout.com"],
    chainId: 84532,
    chainName: "Base Sepolia",
    iconUrls: ["https://app.dynamic.xyz/assets/networks/base.svg"],
    name: "Base Sepolia",
    nativeCurrency: {
      name: "ETH",
      symbol: "ETH",
      decimals: 18,
      iconUrl: "https://app.dynamic.xyz/assets/networks/base.svg",
    },
    networkId: 84532,
    rpcUrls: ["https://sepolia.base.org"],
    vanityName: "Base Sepolia",
  },
];

export const getActiveChain = () => {
  const chain = chains[envs.activeChain];
  if (!chain) {
    throw new Error(`Invalid chain specified: ${envs.activeChain}`);
  }
  return chain;
};

export const getActiveEvmNetwork = () => {
  const chainId = getActiveChain().id;
  const network = evmNetworks.find((n) => n.chainId === chainId);
  if (!network) {
    throw new Error(`No EVM network configuration for chain ID: ${chainId}`);
  }
  return network;
};
