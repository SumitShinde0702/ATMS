import OpenAI from "openai";

export interface VaultState {
  usdcBalance: number;
  solBalance: number;
  totalUsd: number;
}

export interface QuoteSummary {
  inputMint: string;
  outputMint: string;
  inAmount: string;
  outAmount: string;
  priceImpactPct?: string;
}

export interface DeepseekRecommendation {
  recommend: boolean;
  amountPercent: number;
  rationale: string;
}

const MINTS: Record<string, { decimals: number; name: string }> = {
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: { decimals: 6, name: "USDC" },
  Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB: { decimals: 6, name: "USDT" },
  "2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo": { decimals: 6, name: "PYUSD" },
  So11111111111111111111111111111111111111112: { decimals: 9, name: "SOL" },
};

const SYSTEM_PROMPT = `You are a conservative corporate treasury advisor. Recommend swaps only when yield opportunity clearly exceeds risk. 
Respond with valid JSON only. Format: {"recommend": true|false, "amountPercent": 0-100, "rationale": "brief reason"}`;

function formatAmount(mint: string, raw: string): string {
  const n = Number(raw) || 0;
  const info = MINTS[mint];
  if (info) return `${(n / 10 ** info.decimals).toFixed(info.decimals === 6 ? 2 : 4)} ${info.name}`;
  return raw;
}

function assetName(mint: string): string {
  return MINTS[mint]?.name ?? "token";
}

export async function askDeepseek(
  vaultState: VaultState,
  quote: QuoteSummary
): Promise<DeepseekRecommendation> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY not set");
  }

  const client = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey,
  });

  const inAsset = assetName(quote.inputMint);
  const outAsset = assetName(quote.outputMint);
  const inHuman = formatAmount(quote.inputMint, quote.inAmount);
  const outHuman = formatAmount(quote.outputMint, quote.outAmount);
  const impact = quote.priceImpactPct ? parseFloat(quote.priceImpactPct).toFixed(4) : "N/A";

  const userPrompt = `Vault: ${vaultState.usdcBalance.toLocaleString()} USDC, ${vaultState.solBalance} SOL. Total USD: $${vaultState.totalUsd.toLocaleString()}.

Swap quote: ${inHuman} -> ${outHuman}
Direction: ${inAsset} to ${outAsset}
Price impact: ${impact}%

Only recommend if yield opportunity > 0.15%. Respond with JSON only.`;

  try {
    const completion = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim()) as DeepseekRecommendation;

    return {
      recommend: Boolean(parsed.recommend),
      amountPercent: Math.min(100, Math.max(0, Number(parsed.amountPercent) || 10)),
      rationale: String(parsed.rationale ?? "AI recommendation"),
    };
  } catch (e) {
    throw e instanceof Error ? e : new Error(String(e));
  }
}
