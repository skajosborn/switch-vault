import { ethers } from 'hardhat';
import { DeadManSwitchVault__factory, DeadManSwitchFactory__factory } from '../contracts';

async function main() {
  console.log('🚀 Deploying Dead Man\'s Switch Wallet System...\n');

  // Get deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`📋 Deploying contracts with account: ${deployer.address}`);
  console.log(`💰 Account balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH\n`);

  // Deploy Factory Contract
  console.log('🏭 Deploying DeadManSwitchFactory...');
  const DeadManSwitchFactory = await ethers.getContractFactory('DeadManSwitchFactory');
  const factory = await DeadManSwitchFactory.deploy();
  await factory.deployed();
  console.log(`✅ Factory deployed to: ${factory.address}\n`);

  // Deploy a sample vault for testing
  console.log('🔐 Deploying sample vault...');
  
  const walletAddress = deployer.address; // For testing, use deployer's address
  const checkInDeadline = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days from now
  const gracePeriod = 3 * 24 * 60 * 60; // 3 days grace period

  const tx = await factory.deployVault(walletAddress, checkInDeadline, gracePeriod);
  const receipt = await tx.wait();
  
  const vaultDeployedEvent = receipt.events?.find(e => e.event === 'VaultDeployed');
  const vaultAddress = vaultDeployedEvent?.args?.vaultAddress;
  
  console.log(`✅ Sample vault deployed to: ${vaultAddress}\n`);

  // Add sample beneficiaries
  console.log('👥 Adding sample beneficiaries...');
  const vault = DeadManSwitchVault__factory.connect(vaultAddress, deployer);
  
  // Add beneficiary 1 (50%)
  await vault.addBeneficiary(
    '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', // Sample address
    5000 // 50% in basis points
  );
  console.log('✅ Added beneficiary 1 (50%)');

  // Add beneficiary 2 (30%)
  await vault.addBeneficiary(
    '0x8ba1f109551bD432803012645Hac136c772c7cb', // Sample address
    3000 // 30% in basis points
  );
  console.log('✅ Added beneficiary 2 (30%)');

  // Add beneficiary 3 (20%)
  await vault.addBeneficiary(
    '0x1234567890123456789012345678901234567890', // Sample address
    2000 // 20% in basis points
  );
  console.log('✅ Added beneficiary 3 (20%)\n');

  // Verify deployment
  console.log('🔍 Verifying deployment...');
  
  const vaultInfo = await vault.getVaultInfo(deployer.address);
  console.log(`📊 Vault Info:`);
  console.log(`   - Wallet Address: ${vaultInfo.walletAddress}`);
  console.log(`   - Check-in Deadline: ${new Date(vaultInfo.checkInDeadline * 1000).toISOString()}`);
  console.log(`   - Grace Period: ${vaultInfo.gracePeriod / (24 * 60 * 60)} days`);
  console.log(`   - Is Active: ${vaultInfo.isActive}`);
  console.log(`   - Beneficiary Count: ${vaultInfo.beneficiaryCount}`);
  console.log(`   - Funds Transferred: ${vaultInfo.fundsTransferred}\n`);

  // Test check-in functionality
  console.log('✅ Testing check-in functionality...');
  await vault.checkIn();
  console.log('✅ Check-in successful\n');

  // Save deployment info
  const deploymentInfo = {
    network: await deployer.provider?.getNetwork(),
    factoryAddress: factory.address,
    sampleVaultAddress: vaultAddress,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    checkInDeadline: new Date(checkInDeadline * 1000).toISOString(),
    gracePeriod: `${gracePeriod / (24 * 60 * 60)} days`,
    beneficiaries: [
      { address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6', share: '50%' },
      { address: '0x8ba1f109551bD432803012645Hac136c772c7cb', share: '30%' },
      { address: '0x1234567890123456789012345678901234567890', share: '20%' }
    ]
  };

  console.log('📄 Deployment Summary:');
  console.log(JSON.stringify(deploymentInfo, null, 2));

  // Save to file
  const fs = require('fs');
  fs.writeFileSync(
    'deployment-info.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('\n💾 Deployment info saved to deployment-info.json');

  console.log('\n🎉 Deployment completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update your frontend with the factory address');
  console.log('2. Test the check-in functionality');
  console.log('3. Set up automated monitoring');
  console.log('4. Configure Chainlink Automation for production');
}

// Error handling
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Deployment failed:', error);
    process.exit(1);
  });
