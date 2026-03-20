/**
 * Squads multi-sig integration for human-in-the-loop swap execution.
 * When SQUADS_CREATE_KEY is set, creates Squads proposals instead of direct execution.
 */
import {
  AddressLookupTableAccount,
  Connection,
  Keypair,
  PublicKey,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import {
  generated,
  getVaultPda,
  rpc as squadsRpc,
} from "@sqds/multisig";

const RPC = process.env.VITE_SOLANA_RPC ?? process.env.SOLANA_RPC ?? "https://api.devnet.solana.com";

export function getSquadsCreateKeypair(): Keypair | null {
  const raw = process.env.SQUADS_CREATE_KEY;
  if (!raw?.trim()) return null;
  try {
    const arr = JSON.parse(raw) as number[];
    if (!Array.isArray(arr) || arr.length !== 64) return null;
    return Keypair.fromSecretKey(Uint8Array.from(arr));
  } catch {
    return null;
  }
}

export function hasSquadsConfig(): boolean {
  const multisig = process.env.SQUADS_MULTISIG_PDA ?? process.env.SQUADS_MULTISIG;
  const vault = process.env.VITE_SQUADS_VAULT ?? process.env.SQUADS_VAULT;
  const creator = getSquadsCreateKeypair();
  return !!(multisig && vault && creator);
}

/**
 * Fetch address lookup table accounts referenced by a v0 message.
 */
async function fetchAddressLookupTables(
  connection: Connection,
  message: { addressTableLookups?: { accountKey: PublicKey }[] }
): Promise<AddressLookupTableAccount[]> {
  const lookups = message.addressTableLookups;
  if (!lookups?.length) return [];

  const accounts = await Promise.all(
    lookups.map(({ accountKey }) =>
      connection.getAddressLookupTable(accountKey)
    )
  );

  return accounts
    .filter((r) => r.value != null)
    .map((r) => r.value!);
}

/**
 * Convert Jupiter VersionedTransaction to TransactionMessage for Squads.
 */
async function versionedTxToTransactionMessage(
  connection: Connection,
  versionedTx: VersionedTransaction
): Promise<TransactionMessage> {
  const msg = versionedTx.message;

  let addressLookupTableAccounts: AddressLookupTableAccount[] | undefined;
  if (msg.version === "v0" && "addressTableLookups" in msg) {
    addressLookupTableAccounts = await fetchAddressLookupTables(connection, msg);
  }

  return TransactionMessage.decompile(msg, {
    addressLookupTableAccounts: addressLookupTableAccounts ?? [],
  });
}

export interface CreateSquadsProposalResult {
  success: boolean;
  signature?: string;
  transactionIndex?: bigint;
  error?: string;
}

/**
 * Create a Squads vault transaction + proposal from a Jupiter swap.
 * The swap must be built for the vault address (userPublicKey: vault).
 */
export async function createSquadsProposalFromSwap(
  swapTransactionBase64: string,
  vault: string,
  memo?: string
): Promise<CreateSquadsProposalResult> {
  const multisigRaw = process.env.SQUADS_MULTISIG_PDA ?? process.env.SQUADS_MULTISIG;
  const vaultIndex = parseInt(process.env.SQUADS_VAULT_INDEX ?? "0", 10);
  const creator = getSquadsCreateKeypair();

  if (!multisigRaw || !creator) {
    return {
      success: false,
      error: "Squads not configured: set SQUADS_MULTISIG_PDA and SQUADS_CREATE_KEY",
    };
  }

  const multisigPda = new PublicKey(multisigRaw);
  const vaultPda = new PublicKey(vault);

  // Validate vault matches expected PDA
  const [expectedVault] = getVaultPda({ multisigPda, index: vaultIndex });
  if (!expectedVault.equals(vaultPda)) {
    return {
      success: false,
      error: `Vault ${vault} does not match multisig vault at index ${vaultIndex}`,
    };
  }

  const connection = new Connection(RPC);

  try {
    const txBuf = Buffer.from(swapTransactionBase64, "base64");
    const versionedTx = VersionedTransaction.deserialize(txBuf);

    const transactionMessage = await versionedTxToTransactionMessage(
      connection,
      versionedTx
    );

    const multisig = await generated.Multisig.fromAccountAddress(connection, multisigPda);
    const transactionIndex = BigInt(
      typeof multisig.transactionIndex === "object" && "toNumber" in multisig.transactionIndex
        ? (multisig.transactionIndex as { toNumber: () => number }).toNumber()
        : Number(multisig.transactionIndex)
    );

    // Fetch lookup tables for the Jupiter swap (v0 message)
    let addressLookupTableAccounts: AddressLookupTableAccount[] | undefined;
    if (versionedTx.message.version === "v0" && "addressTableLookups" in versionedTx.message) {
      addressLookupTableAccounts = await fetchAddressLookupTables(
        connection,
        versionedTx.message
      );
    }

    // 1. Create vault transaction
    const vaultTxSig = await squadsRpc.vaultTransactionCreate({
      connection,
      feePayer: creator,
      multisigPda,
      transactionIndex,
      creator: creator.publicKey,
      rentPayer: creator.publicKey,
      vaultIndex,
      ephemeralSigners: 0,
      transactionMessage,
      addressLookupTableAccounts,
      memo: memo ?? undefined,
      signers: [creator],
    });

    // 2. Create proposal for the vault transaction
    const proposalSig = await squadsRpc.proposalCreate({
      connection,
      feePayer: creator,
      creator,
      multisigPda,
      transactionIndex,
      signers: [creator],
    });

    return {
      success: true,
      signature: proposalSig,
      transactionIndex,
    };
  } catch (e) {
    const err = e instanceof Error ? e : new Error(String(e));
    return {
      success: false,
      error: err.message,
    };
  }
}
