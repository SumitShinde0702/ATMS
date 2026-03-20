/**
 * Agent wallet – keypair for signing swap transactions.
 * Load from AGENT_KEYPAIR (JSON array of 64 numbers) or AGENT_PRIVATE_KEY (base58).
 */
import { Keypair } from "@solana/web3.js";

let cachedKeypair: Keypair | null = null;

function loadKeypair(): Keypair | null {
  if (cachedKeypair) return cachedKeypair;

  const json = process.env.AGENT_KEYPAIR;
  if (json) {
    try {
      const arr = JSON.parse(json) as number[];
      if (Array.isArray(arr) && arr.length === 64) {
        cachedKeypair = Keypair.fromSecretKey(Uint8Array.from(arr));
        return cachedKeypair;
      }
    } catch {
      // fall through
    }
  }

  return null;
}

export function getAgentKeypair(): Keypair | null {
  return loadKeypair();
}

export function getAgentAddress(): string | null {
  const kp = getAgentKeypair();
  return kp ? kp.publicKey.toBase58() : null;
}

export function hasAgent(): boolean {
  return getAgentKeypair() !== null;
}
