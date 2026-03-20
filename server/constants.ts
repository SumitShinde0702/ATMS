export const TOKENS = {
  USDC: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  USDC_DEVNET: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
  USDT: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  PYUSD: "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo",
  SOL: "So11111111111111111111111111111111111111112",
} as const;

/** Stablecoins (6 decimals). SOL is native (9 decimals). */
export const STABLECOINS = ["USDC", "USDT", "PYUSD"] as const;

export const JUPITER_QUOTE_API = "https://api.jup.ag/swap/v1/quote";
export const JUPITER_SWAP_API = "https://api.jup.ag/swap/v1/swap-instructions";
export const JUPITER_SWAP_TX_API = "https://api.jup.ag/swap/v1/swap";
