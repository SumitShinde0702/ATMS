/**
 * Check agent wallet SOL balance.
 * Run: npm run check:agent
 */
import "dotenv/config";
import { Connection, PublicKey } from "@solana/web3.js";
import { getAgentAddress } from "../server/agent.js";

const RPC = process.env.VITE_SOLANA_RPC ?? process.env.SOLANA_RPC ?? "https://api.devnet.solana.com";

async function main() {
  const address = getAgentAddress();
  if (!address) {
    console.log("Agent not configured. Set AGENT_KEYPAIR in .env");
    process.exit(1);
  }

  const connection = new Connection(RPC);
  const balance = await connection.getBalance(new PublicKey(address));

  console.log("\nAgent wallet:", address);
  console.log("SOL balance:", balance / 1e9, "SOL");
  console.log("RPC:", RPC);
  console.log("");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
