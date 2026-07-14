# Apyee Engage Check-in Contract

Daily check-in smart contract on opBNB.

## Tech Stack

- Solidity 0.8.24
- Hardhat (TypeScript)
- OpenZeppelin Contracts v5
- Network: opBNB (Chain ID: 204)

## Contract Functions

| Function | Description |
|----------|-------------|
| `checkIn()` | Perform a check-in (limited to once per day) |
| `hasCheckedInToday(address)` | Whether the address has checked in today |
| `hasCheckedIn(address, day)` | Whether the address checked in on a given day |
| `userCheckInCount(address)` | Cumulative check-in count per user |
| `totalCheckIns()` | Total number of check-ins |

## Setup

```bash
npm install
cp .env.example .env
# Fill in DEPLOYER_PRIVATE_KEY and BSCSCAN_API_KEY in .env
```

## Commands

```bash
npm run compile          # Compile contracts
npm test                 # Run tests
npm run deploy:testnet   # Deploy to opBNB testnet
npm run deploy:mainnet   # Deploy to opBNB mainnet
npm run verify:mainnet   # Verify contract on mainnet
```

## Check-in Flow

```
User → checkIn() → daily-limit check → record check-in
```
