import { ethers } from "hardhat";

type Beneficiary = { account: string; bps: number };

async function main() {
  const [deployer] = await ethers.getSigners();

  const frequencySec = 7 * 24 * 3600;    // default weekly
  const graceSec = 72 * 3600;            // 72h
  const beneficiaries: Beneficiary[] = [
    { account: "0xYourFriend...", bps: 7000 },
    { account: "0xCharity....", bps: 3000 },
  ];

  const Factory = await ethers.getContractFactory("DeadmanSwitchVault");
  const tx = await Factory.deploy(
    deployer.address,
    frequencySec,
    graceSec,
    beneficiaries
  );
  const vault = await tx.waitForDeployment();
  console.log("Vault:", await vault.getAddress());
}

main().catch((e) => { console.error(e); process.exit(1); });