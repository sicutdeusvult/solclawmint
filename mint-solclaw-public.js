/**
 * 🦀 Sol Claws — Agent Minting Script
 *
 * Mints a Sol Claw NFT on Solana via the agent challenge-response flow.
 *
 * Prerequisites:
 *   npm install @solana/web3.js bs58
 *
 * Usage:
 *   1. Set AGENT_PRIVATE_KEY below (Solana wallet with 0.06+ SOL)
 *   2. Run: node mint-solclaw.js
 */

const { Connection, Keypair, Transaction, LAMPORTS_PER_SOL } = require("@solana/web3.js");
const bs58 = require("bs58");

// ═══════════════════════════════════════════════════════
// CONFIG — Fill in your own values
// ═══════════════════════════════════════════════════════
const AGENT_PRIVATE_KEY = "YOUR_SOLANA_PRIVATE_KEY_BASE58"; // Your wallet's base58 private key
const SOLANA_RPC = "https://api.mainnet-beta.solana.com";   // Or your own RPC (Helius, QuickNode, etc.)
const API_BASE = "https://solclaws.io";

// ═══════════════════════════════════════════════════════
// CHALLENGE SOLVER
// ═══════════════════════════════════════════════════════
function solveChallenge(challenge) {
  const mathMatch = challenge.match(/What is (.+)\?/);
  if (mathMatch) {
    try { return String(Function(`"use strict"; return (${mathMatch[1].trim()})`)()); } catch {}
  }

  const seqMatch = challenge.match(/What comes next:\s*([\d,\s]+?)\s*\?/);
  if (seqMatch) {
    const nums = seqMatch[1].split(",").map(n => parseInt(n.trim())).filter(n => !isNaN(n));
    const known = {
      "2,6,18,54": "162", "1,1,2,3,5,8": "13", "3,9,27,81": "243",
      "1,4,9,16,25": "36", "2,3,5,7,11,13": "17", "0,1,1,2,3,5,8,13": "21",
    };
    const key = nums.join(",");
    if (known[key]) return known[key];

    if (nums.length >= 3 && nums[0] !== 0) {
      const r = nums[1] / nums[0];
      if (nums.every((n, i) => i === 0 || Math.abs(n / nums[i-1] - r) < 0.001))
        return String(Math.round(nums[nums.length - 1] * r));
    }
    if (nums.length >= 4) {
      if (nums.every((n, i) => i < 2 || n === nums[i-1] + nums[i-2]))
        return String(nums[nums.length - 1] + nums[nums.length - 2]);
    }
  }

  const codeMatch = challenge.match(/Evaluate: (.+)/);
  if (codeMatch) {
    try { return String(Function(`"use strict"; return (${codeMatch[1]})`)()); } catch {}
  }
  return null;
}

// ═══════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════
async function api(method, path, body = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  return res.json();
}

// ═══════════════════════════════════════════════════════
// MINT
// ═══════════════════════════════════════════════════════
async function mint() {
  console.log(`
  🦀 ═══════════════════════════════════════════════════════
     SOL CLAWS — Agent Mint
     Network: Solana Mainnet
     Price: 0.05 SOL
  ═══════════════════════════════════════════════════════════
  `);

  if (AGENT_PRIVATE_KEY === "YOUR_SOLANA_PRIVATE_KEY_BASE58") {
    console.error("❌ Set your AGENT_PRIVATE_KEY first!");
    process.exit(1);
  }

  const connection = new Connection(SOLANA_RPC, "confirmed");
  const keypair = Keypair.fromSecretKey(
    bs58.default ? bs58.default.decode(AGENT_PRIVATE_KEY) : bs58.decode(AGENT_PRIVATE_KEY)
  );
  const wallet = keypair.publicKey.toBase58();

  console.log("🔑 Wallet:", wallet);
  const balance = await connection.getBalance(keypair.publicKey);
  console.log("💰 Balance:", (balance / LAMPORTS_PER_SOL).toFixed(4), "SOL\n");

  if (balance < 0.06 * LAMPORTS_PER_SOL) {
    console.error("❌ Need at least 0.06 SOL (0.05 mint + fees)");
    process.exit(1);
  }

  // Check supply
  const status = await api("GET", "/api/status");
  console.log(`📊 Minted: ${status.minted} / ${status.maxSupply}`);

  // Step 1: Get challenge
  console.log("\n📝 Step 1: Requesting challenge...");
  const challengeData = await api("POST", "/api/challenge", { walletAddress: wallet });
  if (!challengeData.challenge) {
    console.error("❌ Failed:", challengeData);
    process.exit(1);
  }
  console.log("   Challenge:", challengeData.challenge);

  // Step 2: Solve
  console.log("\n🧠 Step 2: Solving...");
  const answer = solveChallenge(challengeData.challenge);
  if (!answer) {
    console.error("❌ Could not solve:", challengeData.challenge);
    process.exit(1);
  }
  console.log("   Answer:", answer);

  // Step 3: Get mint tx
  console.log("\n🔐 Step 3: Getting mint transaction...");
  const mintData = await api("POST", "/api/mint", {
    walletAddress: wallet,
    challengeId: challengeData.challengeId,
    answer,
  });
  if (!mintData.paymentTransaction) {
    console.error("❌ Mint failed:", mintData.error || mintData);
    process.exit(1);
  }
  console.log("   Token:", mintData.mintDetails.name);
  console.log("   Traits:", mintData.mintDetails.traits.length, "attributes");

  // Step 4: Sign payment & submit
  console.log("\n🚀 Step 4: Signing payment & executing mint...");
  const txBuffer = Buffer.from(mintData.paymentTransaction, "base64");
  const tx = Transaction.from(txBuffer);
  tx.sign(keypair);

  const signedTx = tx.serialize().toString("base64");

  const result = await api("POST", "/api/execute", {
    signedTransaction: signedTx,
    mintDetails: mintData.mintDetails,
    walletAddress: wallet,
  });

  if (result.success) {
    console.log(`
  🎉 ═══════════════════════════════════════════════════════
     SUCCESS! ${result.name} minted!
  ═══════════════════════════════════════════════════════════

     Payment TX: ${result.paymentTx}
     Asset:      ${result.assetAddress}

     Explorer:   ${result.explorer}
     Magic Eden: ${result.magicEden}

     Traits:
${mintData.mintDetails.traits.map(t => `       ${t.trait_type}: ${t.value}`).join("\n")}
  ═══════════════════════════════════════════════════════════
    `);
  } else {
    console.error("❌ Mint failed:", result.error || result);
    if (result.details) console.error("   Details:", result.details);
    if (result.logs && result.logs.length) console.error("   Logs:", result.logs);
  }
}

mint().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
