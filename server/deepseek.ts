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

const SYSTEM_PROMPT = `You are a conservative corporate treasury advisor. Recommend swaps only when yield opportunity clearly exceeds risk. 
Respond with valid JSON only. Format: {"recommend": true|false, "amountPercent": 0-100, "rationale": "brief reason"}`;

export async function askDeepseek(
  vaultState: VaultState,
  quote: QuoteSummary
): Promise<DeepseekRecommendation> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    return {
      recommend: quote.priceImpactPct ? Math.abs(parseFloat(quote.priceImpactPct)) < 1 : true,
      amountPercent: 10,
      rationale: "Fallback: no DEEPSEEK_API_KEY",
    };
  }

  const client = new OpenAI({
    baseURL: "https://api.deepseek.com/v1",
    apiKey,
  });

  const userPrompt = `Vault: ${vaultState.usdcBalance.toLocaleString()} USDC, ${vaultState.solBalance} SOL. Total USD: $${vaultState.totalUsd.toLocaleString()}.
Quote: swap ${quote.inAmount} -> ${quote.outAmount} (price impact: ${quote.priceImpactPct ?? "N/A"}%).
Only recommend if yield > 0.15%. Respond with JSON only.`;

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
  } catch {
    return { recommend: true, amountPercent: 10, rationale: "Fallback: API error" };
  }
}
