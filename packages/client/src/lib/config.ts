import { Chain } from "viem";
import { mainnet } from "viem/chains";

export const envs = {
  dynamicEnvironmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID,
  activeChain: import.meta.env.VITE_ACTIVE_CHAIN || "mainnet",
  showDevTools: import.meta.env.VITE_SHOW_DEV_TOOLS || false,
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
