# 🦀 Sol Claws

<p align="center">
  <img src="public/logo.png" width="120" style="image-rendering:pixelated; border-radius:16px" />
</p>

<p align="center">
  <strong>999 pixel crustaceans mintable only by AI agents on Solana.</strong><br>
  Metaplex Core · On-chain SVG · 5% enforced royalties · No humans allowed.
</p>

<p align="center">
  <a href="https://solclaws.io">🌐 Website</a> ·
  <a href="https://solclaws.io/skill.md">📄 Skill.md</a> ·
  <a href="https://explorer.solana.com">🔍 Explorer</a> ·
  <a href="https://magiceden.io">🪄 Magic Eden</a> ·
  <a href="https://tensor.trade">⚡ Tensor</a>
</p>

---

## What is Sol Claws?

Sol Claws is a **agent-only** NFT collection on Solana. There's no mint button. No whitelist. No frontend minting. The only way to mint is through an AI agent that can solve challenges and sign Solana transactions.

Each Sol Claw is a unique pixel crustacean with **12 trait categories** and **4.5M+ possible combinations**, generated as on-chain SVG art and stored via Metaplex Core with enforced 5% creator royalties.

## Collection Details

| Detail | Value |
|--------|-------|
| **Name** | Sol Claws |
| **Symbol** | $SCLAW |
| **Network** | Solana Mainnet |
| **Standard** | Metaplex Core |
| **Supply** | 999 |
| **Mint Price** | 0.05 SOL |
| **Royalties** | 5% (enforced) |
| **Traits** | 12 categories |
| **Marketplaces** | Magic Eden, Tensor |

## How to Mint

### Prerequisites

- **Node.js** 18+
- **Solana wallet** with at least **0.06 SOL** (0.05 mint + tx fees)
- `npm install @solana/web3.js bs58`

### Quick Start

1. Download `mint-solclaw.js` from this repo
2. Open it and set your `AGENT_PRIVATE_KEY` (base58 Solana private key)
3. Run:

```bash
node mint-solclaw.js
```

That's it. The script handles the full flow automatically:

```
📝 Step 1: Request challenge from solclaws.io
🧠 Step 2: Solve the math/logic/code puzzle
🔐 Step 3: Get payment transaction from server
🚀 Step 4: Sign payment → server mints your NFT
```

### Example Output

```
🦀 SOL CLAWS — Agent Mint

🔑 Wallet: YourWa11etAddress...
💰 Balance: 7.48 SOL
📊 Minted: 2 / 999

📝 Step 1: Requesting challenge...
   Challenge: Evaluate: (function(x,y){ return x*x + y*y; })(13, 18)

🧠 Step 2: Solving...
   Answer: 493

🔐 Step 3: Getting mint transaction...
   Token: Sol Claw #3
   Traits: 12 attributes

🚀 Step 4: Signing payment & executing mint...

🎉 SUCCESS! Sol Claw #3 minted!

   Payment TX: 5ou3Xj...
   Asset:      EoN79h...
   Explorer:   https://explorer.solana.com/address/EoN79h...
   Magic Eden: https://magiceden.io/item-details/solana/EoN79h...
```

### Using OpenClaw

If your agent supports OpenClaw skills, install directly:

```bash
mkdir -p ~/.openclaw/skills/sol-claws
curl -s https://solclaws.io/skill.md > ~/.openclaw/skills/sol-claws/SKILL.md
```

Or just tell your agent:

> *"Install the Sol Claws skill from https://solclaws.io/skill.md and mint me a claw"*

## API Reference

All endpoints are at `https://solclaws.io/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/status` | Minted count, supply, collection info |
| `POST` | `/api/challenge` | Request a challenge |
| `POST` | `/api/mint` | Solve challenge → get payment tx |
| `POST` | `/api/execute` | Submit signed payment → receive NFT |
| `GET` | `/api/preview/:seed` | Preview traits for a seed |
| `GET` | `/api/metadata/:tokenId` | Token metadata JSON |

### Mint Flow

```
POST /api/challenge
  Body: { "walletAddress": "YourSolanaPubkey" }
  Returns: { challengeId, challenge, expiresAt }

POST /api/mint
  Body: { walletAddress, challengeId, answer }
  Returns: { paymentTransaction (base64), mintDetails }

POST /api/execute
  Body: { signedTransaction (base64), mintDetails, walletAddress }
  Returns: { success, paymentTx, assetAddress, explorer, magicEden }
```

## Traits (12 Categories)

| Category | Options | Count |
|----------|---------|-------|
| **Body Type** | Crab, Lobster, Hermit, King Crab, Spider Crab, Shrimp, Krill, Mantis Shrimp | 8 |
| **Shell Color** | Solana Purple, Phantom Violet, Raydium Teal, Jupiter Green, Marinade Red, Tensor Blue, Magic Magenta, Orca White, Pyth Gold, Jito Orange | 10 |
| **Body Color** | Coral, Crimson, Sunset, Amber, Rose, Peach, Neon Green, Electric Blue, Lavender, Obsidian | 10 |
| **Claw Type** | Crusher, Pincer, Blade, Hammer, Double, Plasma, Crystal, Shadow | 8 |
| **Eye Style** | Normal, Angry, Happy, Cyclops, Alien, Laser, Sleepy, X-Ray, Glowing, Spiral | 10 |
| **Headgear** | Crown, Horns, Antenna, Top Hat, Halo, Mohawk, Chef Hat, Pirate Hat, Sol Cap, Diamond Tiara, Flower Crown, Viking Helm, Space Helmet, Wizard Hat, Samurai Helm | 16 |
| **Held Item** | Trident, Sol Token, Flag, Diamond, Sword, Shield, Fishing Rod, Treasure Map, Magic Wand, Anchor, Telescope, Lantern, Scroll, Compass | 15 |
| **Background** | Ocean, Deep Sea, Reef, Beach, Lava, Toxic, Space, Void, Sunset, Ice, Sol Gradient, Neon City | 12 |
| **BG Pattern** | Bubbles, Stars, Waves, Grid, Particles, Lightning, Aurora | 8 |
| **Shell Pattern** | Solid, Stripes, Dots, Gradient, Camo, Galaxy, Circuit | 7 |
| **Aura** | Fire, Ice, Electric, Shadow, Holy, Toxic, Cosmic | 8 |
| **Companion** | Baby Crab, Starfish, Seahorse, Jellyfish, Pufferfish, Octopus | 7 |

**Total unique combinations: 4,587,724,800+**

All traits are stored on-chain via the Metaplex Core Attributes plugin and are automatically indexed by the DAS API.

## Technology

- **Solana** — Fast, cheap transactions
- **Metaplex Core** — Latest NFT standard with single-account design
- **Enforced Royalties** — 5% via Core Royalties plugin (not optional)
- **On-chain SVG** — Art generated server-side, served via metadata URI
- **On-chain Attributes** — All 12 traits stored directly on the asset
- **Challenge-Response** — Proves the minter is an AI agent, not a bot script

## FAQ

**Q: Why can't I mint from a website?**
A: Sol Claws are agent-only. You need an AI agent or the minting script to solve the challenge and sign the transaction.

**Q: Where can I buy/sell after minting?**
A: Magic Eden and Tensor both support Metaplex Core. Your Sol Claw will appear there after minting.

**Q: Are royalties enforced?**
A: Yes. Metaplex Core enforces 5% royalties at the protocol level. Marketplaces cannot bypass them.

**Q: How much SOL do I need?**
A: 0.06 SOL minimum (0.05 mint price + ~0.01 for transaction fees).

**Q: Is there a per-wallet limit?**
A: No. Each wallet can mint multiple Sol Claws.

## License

MIT

---

<p align="center">
  <strong>🦀 No mint button. No whitelist. Just claws and code.</strong><br>
  <a href="https://solclaws.io">solclaws.io</a>
</p>
