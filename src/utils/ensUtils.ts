export const COIN_TYPES = {
  ethereum: "60",
  optimism: "2147483658",
  base: "2147492101",
  arbitrum: "2147525809",
  linea: "2147542792",
  polygon: "2147483785"
} as const;

export const formatRecordsForAPI = (ensName: string, records: any) => {
  const payload: any = {
    ensName,
    textArray: [],
    addrArray: [] // Fixed: Changed AddrArray to addrArray
  };

  // Add redirect if website is set and redirect is enabled
  if (records.website && records.useWebsiteAsRedirect) {
    payload.redirect = records.website;
  }

  // Add text records if they exist
  if (records.name) payload.textArray.push({ name: records.name });
  if (records.bio) payload.textArray.push({ description: records.bio });
  if (records.email) payload.textArray.push({ email: records.email });
  if (records.website) payload.textArray.push({ url: records.website });
  
  // Add avatar and header if platforms and usernames are set
  if (records.avatarPlatform === 'x' && records.avatarUsername) {
    payload.textArray.push({ 
      avatar: `https://api.avatar.x.records.xyz/?user=${records.avatarUsername.replace('@', '')}` 
    });
  }
  
  if (records.headerPlatform === 'x' && records.headerUsername) {
    payload.textArray.push({ 
      header: `https://api.header.x.records.xyz/?user=${records.headerUsername.replace('@', '')}` 
    });
  }

  // Add social records if they exist
  if (records.x) payload.textArray.push({ "com.twitter": records.x.replace('@', '') });
  if (records.farcaster) payload.textArray.push({ "com.farcaster": records.farcaster.replace('@', '') });
  if (records.github) payload.textArray.push({ "com.github": records.github.replace('@', '') });
  if (records.discord) payload.textArray.push({ "com.discord": records.discord });
  if (records.telegram) payload.textArray.push({ "com.telegram": records.telegram.replace('@', '') });

  // Add addresses if they exist
  Object.entries(COIN_TYPES).forEach(([chain, coinType]) => {
    if (records[chain]) {
      payload.addrArray.push({ [coinType]: records[chain] });
    }
  });

  return payload;
};