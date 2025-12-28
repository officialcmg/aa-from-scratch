# AA From Scratch

Building ERC-4337 Account Abstraction from scratch to understand the core concepts.

## What's in here

### Smart Contracts (`src/`)

- **Account.sol** - A minimal smart contract wallet implementing `IAccount` interface
  - `validateUserOp()` - Validates user operations (currently returns 0, no signature check)
  - `execute()` - Increments a counter (for testing)
  
- **AccountFactory** - Factory contract to deploy new Account instances via `createAccount(owner)`

### Deploy Scripts (`script/`)

- **DeployEntryPoint.s.sol** - Deploys the ERC-4337 EntryPoint contract
- **DeployAccountFactory.s.sol** - Deploys the AccountFactory

### JS Scripts (`scripts/`)

- **userOp.js** - Constructs and submits a UserOperation to the EntryPoint
  - Calculates counterfactual sender address
  - Builds initCode for account creation (only needed first time around)
  - Prefunds the account via `depositTo()`
  - Calls `handleOps()` on EntryPoint

- **state.js** - Reads the `count` state from the deployed smart account
- **utils.js** - Viem client setup and ABI definitions

## How ERC-4337 Works (simplified)

```
User creates UserOperation
        ↓
Call EntryPoint.handleOps()
        ↓
EntryPoint calls sender.validateUserOp()
        ↓
EntryPoint calls sender with callData
        ↓
Smart account executes the action
```

**Key insight**: UserOperations don't have a `to` field. The `sender` IS the smart account, and `callData` is executed ON the sender. To call external contracts, your account's `execute()` function handles the actual `.call()`.

## Quick Start

```bash
# Install dependencies
forge soldeer install
npm install

# Start local node (with increased code size limit for EntryPoint)
anvil --code-size-limit 50000

# Deploy contracts (in another terminal)
source .env
forge script script/DeployEntryPoint.s.sol --broadcast --rpc-url http://127.0.0.1:8545
forge script script/DeployAccountFactory.s.sol --broadcast --rpc-url http://127.0.0.1:8545

# Run a UserOperation
npm run userOp

# Check state
npm run state
```

## Dependencies

- [eth-infinitism/account-abstraction v0.6](https://github.com/eth-infinitism/account-abstraction) - ERC-4337 reference implementation
- [OpenZeppelin Contracts v4.2.0](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Foundry](https://book.getfoundry.sh/) - Solidity development toolkit
- [Viem](https://viem.sh/) - TypeScript Ethereum library

## Resources

- [ERC-4337 Spec](https://eips.ethereum.org/EIPS/eip-4337)
- [Account Abstraction Explained](https://www.alchemy.com/overviews/account-abstraction)
