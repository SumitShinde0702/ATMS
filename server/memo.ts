/**
 * Memo program utilities for FATF Travel Rule audit trail on swaps.
 */
import {
  AddressLookupTableAccount,
  Connection,
  PublicKey,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";

const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");

function createMemoInstruction(memo: string): TransactionInstruction {
  return new TransactionInstruction({
    programId: MEMO_PROGRAM_ID,
    keys: [],
    data: Buffer.from(memo, "utf8"),
  });
}

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
 * Add a memo instruction to a Jupiter swap VersionedTransaction.
 * Used for Travel Rule compliance - memo is logged on-chain.
 */
export async function addMemoToSwapTransaction(
  connection: Connection,
  versionedTx: VersionedTransaction,
  memo: string
): Promise<VersionedTransaction> {
  const msg = versionedTx.message;

  let addressLookupTableAccounts: AddressLookupTableAccount[] = [];
  if (msg.version === "v0" && "addressTableLookups" in msg) {
    addressLookupTableAccounts = await fetchAddressLookupTables(connection, msg);
  }

  const transactionMessage = TransactionMessage.decompile(msg, {
    addressLookupTableAccounts,
  });

  const memoIx = createMemoInstruction(memo);
  const newMessage = new TransactionMessage({
    payerKey: transactionMessage.payerKey,
    recentBlockhash: transactionMessage.recentBlockhash,
    instructions: [...transactionMessage.instructions, memoIx],
  });

  const compiled = addressLookupTableAccounts.length > 0
    ? newMessage.compileToV0Message(addressLookupTableAccounts)
    : newMessage.compileToLegacyMessage();

  return new VersionedTransaction(compiled);
}
