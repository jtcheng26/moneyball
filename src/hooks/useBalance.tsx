import { useEffect, useState } from "react";

export default function useBalance(address: string) {
  const apiKey = "api_key_here";
  const url =
    "https://api-testnet.bttcscan.com/api?module=account&action=balance";

  const [balance, setBalance] = useState(0);

  const refreshBalance = async () => {
    const b = await (
      await fetch(url + "&address=" + address + "&apikey=" + apiKey)
    ).json();
    return b;
  };

  useEffect(() => {
    let mounted = true;
    refreshBalance().then((b) => {
      if (mounted) setBalance(parseInt(b["result"]) / Math.pow(10, 18));
    });
    return () => {
      mounted = false;
    };
  }, []);

  return [balance, refreshBalance];
}
