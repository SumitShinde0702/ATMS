/**
 * Generate an agent keypair for .env
 * Run: npx tsx scripts/generate-agent-keypair.ts
 *
 * Add the output to .env as AGENT_KEYPAIR="[...]"
 */
import { Keypair } from "@solana/web3.js";

const kp = Keypair.generate();
const secret = Array.from(kp.secretKey);

console.log("\nAdd to your .env:\n");
console.log(`AGENT_KEYPAIR="[${secret.join(",")}]"`);
console.log(`\nAgent address (fund with SOL for fees): ${kp.publicKey.toBase58()}`);
console.log("\nDevnet faucet: https://faucet.solana.com/");
console.log("Mainnet: Send SOL to the address above.\n");
