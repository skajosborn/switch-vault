// Simple deployment script for the factory contract
// Run with: node deploy-factory.js

const { ethers } = require('ethers');

// Factory contract bytecode (you'll need to compile this)
const FACTORY_BYTECODE = "0x..."; // TODO: Add compiled bytecode here

const FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_frequencySec",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_graceSec",
        "type": "uint256"
      },
      {
        "components": [
          {
            "internalType": "address",
            "name": "account",
            "type": "address"
          },
          {
            "internalType": "uint96",
            "name": "bps",
            "type": "uint96"
          }
        ],
        "internalType": "struct DeadmanSwitchVault.Beneficiary[]",
        "name": "_beneficiaries",
        "type": "tuple[]"
      }
    ],
    "name": "createVault",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  }
];

async function deployFactory() {
  // Connect to your network (update with your RPC URL and private key)
  const provider = new ethers.JsonRpcProvider("YOUR_RPC_URL");
  const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider);
  
  console.log("Deploying factory contract...");
  
  const factory = new ethers.ContractFactory(FACTORY_ABI, FACTORY_BYTECODE, wallet);
  const deployedFactory = await factory.deploy();
  
  console.log("Factory deployed to:", await deployedFactory.getAddress());
  console.log("Transaction hash:", deployedFactory.deploymentTransaction().hash);
  
  // Wait for deployment
  await deployedFactory.waitForDeployment();
  console.log("Factory deployment confirmed!");
}

// Instructions for use:
console.log("To deploy the factory contract:");
console.log("1. Compile the DeadmanSwitchFactory.sol contract to get the bytecode");
console.log("2. Update FACTORY_BYTECODE with the compiled bytecode");
console.log("3. Update YOUR_RPC_URL with your network's RPC endpoint");
console.log("4. Update YOUR_PRIVATE_KEY with your wallet's private key");
console.log("5. Run: node deploy-factory.js");
console.log("6. Copy the deployed address to src/lib/contracts.ts");

// Uncomment the line below to deploy (after updating the configuration)
// deployFactory().catch(console.error);

