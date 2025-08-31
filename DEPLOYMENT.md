# Deployment Guide

## Overview
This project implements a Dead Man's Switch system using smart contracts. Users can create vaults that automatically distribute funds to beneficiaries if they don't check in within a specified time period.

## Prerequisites
- Node.js 18+ installed
- A wallet with some ETH for gas fees
- Access to an Ethereum network (mainnet, testnet, or local)

## Step 1: Deploy the Factory Contract

The factory contract allows users to create new vaults with one click. You need to deploy this first.

### Option A: Using Remix IDE (Recommended for beginners)
1. Go to [Remix IDE](https://remix.ethereum.org/)
2. Create a new file called `DeadmanSwitchFactory.sol`
3. Copy the contents from `src/contracts/DeadmanSwitchFactory.sol`
4. Compile the contract (Ctrl+S or Cmd+S)
5. Deploy using your wallet
6. Copy the deployed address

### Option B: Using Hardhat (For developers)
1. Navigate to the `dms` directory
2. Install dependencies: `npm install`
3. Compile contracts: `npx hardhat compile`
4. Deploy using the deploy script: `npx hardhat run scripts/deploy-factory.ts --network <your-network>`

### Option C: Using the provided script
1. Install ethers: `npm install ethers`
2. Update `deploy-factory.js` with your RPC URL and private key
3. Get the compiled bytecode from Remix or Hardhat
4. Run: `node deploy-factory.js`

## Step 2: Update Configuration
1. Copy the deployed factory contract address
2. Update `src/lib/contracts.ts`:
   ```typescript
   export const FACTORY_ADDRESS = "0x..."; // Your deployed factory address
   ```

## Step 3: Test the System
1. Start the development server: `npm run dev`
2. Connect your wallet
3. Go to the Create page
4. Fill out the form and deploy a vault
5. The vault will be created and funded with your initial deposit

## Step 4: Set Up Chainlink Automation
After creating a vault:
1. Go to [Chainlink Automation](https://automation.chain.link/)
2. Register a new upkeep with "Custom Logic"
3. Set the contract address to your deployed vault
4. Fund the upkeep with LINK tokens
5. The automation will monitor your vault and execute if you don't check in

## Contract Architecture
- **DeadmanSwitchFactory**: Creates new vaults
- **DeadmanSwitchVault**: Individual vault that holds funds and distributes them

## Security Notes
- Never share your private keys
- Test on testnets first
- Ensure beneficiaries are correct before deploying
- The grace period provides a safety buffer

## Troubleshooting
- **"Factory not deployed"**: Deploy the factory contract first
- **"Insufficient funds"**: Ensure your wallet has enough ETH for gas + deposit
- **"Invalid beneficiaries"**: Total basis points must equal 10000 (100%)
- **"Wallet not connected"**: Connect your wallet using the connect button

## Support
If you encounter issues:
1. Check the browser console for error messages
2. Verify contract addresses are correct
3. Ensure you're on the right network
4. Check that your wallet has sufficient funds

