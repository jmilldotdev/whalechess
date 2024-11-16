export const getBlockscoutTxUrl = (chain: string, txHash: string) => {
  return `https://${chain}.blockscout.com/tx/${txHash}`;
};
