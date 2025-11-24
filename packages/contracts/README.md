# Farcaster Risk Game - Smart Contracts

This package contains the Solidity smart contracts for the Farcaster Risk Game, built with Foundry.

## 🚧 Under Development

This is a placeholder for future smart contract integration. Planned features include:

- **Entry Fees**: Players pay entry fees to join games
- **Prize Pools**: Winners receive prize pools from entry fees
- **NFT Territories**: Mint territories as NFTs for special bonuses
- **Governance**: Token-based governance for game rules
- **Tournaments**: Organize tournaments with prize pools

## Setup

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Installation

```bash
# Install Foundry (if not already installed)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install
```

### Build

```bash
forge build
```

### Test

```bash
forge test
```

### Deploy

```bash
# Copy environment variables
cp .env.example .env

# Edit .env with your values
# Then deploy
forge script script/Deploy.s.sol:Deploy --rpc-url <network> --broadcast
```

## Planned Contracts

### GameRegistry.sol
Manages game creation and registration.

### GameToken.sol
ERC20 token for in-game rewards and governance.

### PrizePool.sol
Handles entry fees and prize distribution.

### TerritoryNFT.sol
ERC721 NFT collection for special territories.

## License

MIT
