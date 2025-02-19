
export const COIN_TYPES = {
  mainnet: "60",
  optimism: "2147483658",
  base: "2147492101",
  arbitrum: "2147525809",
  linea: "2147542792",
  polygon: "2147483785"
} as const;

interface ENSRecords {
  changedRecords?: Record<string, string>;
  [key: string]: any;
}

export const formatRecordsForAPI = (ensName: string, records: Record<string, string>) => {
  console.log('Formatting records for API. Input:', { ensName, records });
  
  if (Object.keys(records).length === 0) {
    console.log('No changed records to format');
    return { ensName };
  }

  const payload: {
    ensName: string;
    textArray: Array<Record<string, string>>;
    addrArray: Array<Record<string, string>>;
    redirect?: string;
  } = {
    ensName,
    textArray: [],
    addrArray: []
  };

  Object.entries(records).forEach(([key, value]) => {
    console.log('Processing record:', { key, value });

    // Handle redirect separately - include even if empty
    if (key === 'redirect') {
      payload.redirect = value;
      console.log('Added redirect:', value);
      return;
    }

    // Handle addresses - set empty values to full zero address
    if (key in COIN_TYPES) {
      const addressRecord: Record<string, string> = {};
      addressRecord[COIN_TYPES[key as keyof typeof COIN_TYPES]] = value || "0x0000000000000000000000000000000000000000";
      payload.addrArray.push(addressRecord);
      console.log('Added address:', {
        coin_type: COIN_TYPES[key as keyof typeof COIN_TYPES],
        addr: value || "0x0000000000000000000000000000000000000000"
      });
      return;
    }

    // Handle text records - include empty values
    let formattedKey = key;
    let formattedValue = value;

    // Format social media handles
    if (key === 'farcaster') {
      formattedKey = 'xyz.farcaster';
      formattedValue = value.startsWith('@') ? value.slice(1) : value;
    } else if (key === 'telegram') {
      formattedKey = 'org.telegram';
      formattedValue = value.startsWith('@') ? value.slice(1) : value;
    } else if (key === 'twitter') {
      formattedKey = 'com.twitter';
      formattedValue = value.startsWith('@') ? value.slice(1) : value;
    } else if (['github', 'discord'].includes(key)) {
      formattedKey = `com.${key}`;
    }

    const textRecord: Record<string, string> = {};
    textRecord[formattedKey] = formattedValue;
    payload.textArray.push(textRecord);
    console.log('Added text record:', { key: formattedKey, value: formattedValue });
  });

  console.log('Final API payload:', payload);
  return payload;
};
