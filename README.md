# Apyee Engage Check-in Contract

Daily check-in smart contract on opBNB.

## Deployment

| | |
|---|---|
| Network | opBNB Mainnet (Chain ID: 204) |
| Contract | `0x9fdE6afdE358cdEAF7B9eF59B615D4cD54cB32Ff` |
| Explorer | https://opbnb.bscscan.com/address/0x9fdE6afdE358cdEAF7B9eF59B615D4cD54cB32Ff#code |
| Source | Verified ✔ |

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
