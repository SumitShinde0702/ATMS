/**
 * Test script for market monitoring.
 * Runs the monitor logic directly (no server needed).
 *
 * Run: npm run test:monitor
 * Or:  npx tsx scripts/test-monitor.ts
 */
import "dotenv/config";
import { runMarketMonitor } from "../server/monitor.js";

async function main() {
  console.log("ATMS Market Monitor Test\n");
  console.log("Checking: USDC, USDT, PYUSD ↔ SOL (6 pairs)...");
  console.log("AI recommends when yield opportunity > 0.15%\n");

  const start = Date.now();
  const { found, proposals } = await runMarketMonitor();
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);

  console.log(`--- Result (${elapsed}s) ---`);
  console.log(`Opportunities found: ${found}`);
  console.log(`Total proposals stored: ${proposals.length}\n`);

  if (proposals.length > 0) {
    console.log("Proposals:");
    proposals.forEach((p, i) => {
      const inHuman = p.direction === "USDC→SOL"
        ? `${(Number(p.inAmount) / 1e6).toFixed(2)} USDC`
        : `${(Number(p.inAmount) / 1e9).toFixed(4)} SOL`;
      const outHuman = p.direction === "USDC→SOL"
        ? `${(Number(p.outAmount) / 1e9).toFixed(4)} SOL`
        : `${(Number(p.outAmount) / 1e6).toFixed(2)} USDC`;
      console.log(`  ${i + 1}. ${p.direction} | ${inHuman} → ${outHuman}`);
      console.log(`     ${p.rationale}`);
      console.log(`     ${p.createdAt}`);
    });
  } else {
    console.log("No opportunities met the 0.15% yield threshold.");
    console.log("(AI may have rejected due to price impact or market conditions)");
  }

  console.log("\n--- API test (optional) ---");
  console.log("If server is running (npm run dev), you can also:");
  console.log("  curl -X POST http://localhost:3001/api/monitor/run");
  console.log("  curl http://localhost:3001/api/proposals");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
