export const txLink = (txHash) => {
  const subDomain = EmbarkJS.environment === 'livenet' ? '' : 'rinkeby.';
  return `https://${subDomain}etherscan.io/tx/${txHash}`;
};

export const prefix0x = s => (String(s).startsWith('0x') ? s : `0x${s}`);
