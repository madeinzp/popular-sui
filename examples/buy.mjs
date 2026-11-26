// Build a buy with the API, show its summary, then sign it with your own key and send it to a Sui full node.
// The key stays on this machine: only the address and the signed bytes leave it.
//
//   SUI_KEY=suiprivkey1... node buy.mjs <token id or coin type> <SUI to spend>
//   POPULAR_KEY=pk_...   optional API key (higher limits)
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { fromBase64 } from "@mysten/sui/utils";
import readline from "node:readline/promises";

const [token, amount = "0.1"] = process.argv.slice(2);
if (!token || !process.env.SUI_KEY) {
  console.error("usage: SUI_KEY=suiprivkey1... node buy.mjs <token> <SUI amount>");
  process.exit(1);
}

const kp = Ed25519Keypair.fromSecretKey(process.env.SUI_KEY);
const res = await fetch("https://popularsui.xyz/api/v1/tx/buy", {
  method: "POST",
  headers: { "content-type": "application/json", ...(process.env.POPULAR_KEY ? { "x-api-key": process.env.POPULAR_KEY } : {}) },
  body: JSON.stringify({ sender: kp.toSuiAddress(), token, amount, slippageBps: 500 }),
}).then((r) => r.json());
if (!res.ok || !res.dryRun?.success) throw new Error(res.error ?? res.dryRun?.error ?? "build failed");

console.log(res.summary.text);
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const yes = (await rl.question("Sign and send? (y/N) ")).trim().toLowerCase() === "y";
rl.close();
if (!yes) process.exit(0);

const bytes = fromBase64(res.transaction);
const { signature } = await kp.signTransaction(bytes);
const client = new SuiGrpcClient({ network: "mainnet", baseUrl: "https://fullnode.mainnet.sui.io:443" });
const out = await client.core.executeTransaction({ transaction: bytes, signatures: [signature] });
console.log(out);
