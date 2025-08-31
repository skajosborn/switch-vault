import { ethers } from 'ethers';
import { DeadManSwitchVault__factory, DeadManSwitchFactory__factory } from '../contracts';

export interface WalletConfig {
  address: string;
  network: string;
  type: 'recovery' | 'distribution' | 'backup';
  name: string;
}

export interface Beneficiary {
  address: string;
  sharePercentage: number; // 0-100
  name: string;
}

export interface VaultConfig {
  walletAddress: string;
  checkInDeadline: number;
  gracePeriod: number;
  beneficiaries: Beneficiary[];
}

export class WalletService {
  private provider: ethers.providers.Provider;
  private factoryContract: DeadManSwitchFactory;
  private signer: ethers.Signer;

  constructor(
    provider: ethers.providers.Provider,
    signer: ethers.Signer,
    factoryAddress: string
  ) {
    this.provider = provider;
    this.signer = signer;
    this.factoryContract = DeadManSwitchFactory__factory.connect(factoryAddress, signer);
  }

  /**
   * Deploy a new vault for a user
   */
  async deployVault(config: VaultConfig): Promise<string> {
    try {
      const deadline = Math.floor(Date.now() / 1000) + config.checkInDeadline;
      const gracePeriod = config.gracePeriod;

      const tx = await this.factoryContract.deployVault(
        config.walletAddress,
        deadline,
        gracePeriod
      );

      const receipt = await tx.wait();
      const event = receipt.events?.find(e => e.event === 'VaultDeployed');
      
      if (!event) {
        throw new Error('Vault deployment failed');
      }

      const vaultAddress = event.args?.vaultAddress;
      
      // Add beneficiaries to the vault
      await this.addBeneficiaries(vaultAddress, config.beneficiaries);

      return vaultAddress;
    } catch (error) {
      console.error('Failed to deploy vault:', error);
      throw error;
    }
  }

  /**
   * Add beneficiaries to a vault
   */
  async addBeneficiaries(vaultAddress: string, beneficiaries: Beneficiary[]): Promise<void> {
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.signer);

    for (const beneficiary of beneficiaries) {
      const shareInBasisPoints = Math.floor(beneficiary.sharePercentage * 100);
      
      await vaultContract.addBeneficiary(
        beneficiary.address,
        shareInBasisPoints
      );
    }
  }

  /**
   * Check in to extend the deadline
   */
  async checkIn(vaultAddress: string): Promise<void> {
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.signer);
    await vaultContract.checkIn();
  }

  /**
   * Transfer funds if deadline has passed
   */
  async transferFundsIfDeadlinePassed(userAddress: string): Promise<void> {
    const vaultAddress = await this.factoryContract.getVaultAddress(userAddress);
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.signer);
    
    await vaultContract.transferFundsIfDeadlinePassed(userAddress);
  }

  /**
   * Transfer ERC20 tokens if deadline has passed
   */
  async transferERC20IfDeadlinePassed(
    userAddress: string, 
    tokenAddress: string
  ): Promise<void> {
    const vaultAddress = await this.factoryContract.getVaultAddress(userAddress);
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.signer);
    
    await vaultContract.transferERC20IfDeadlinePassed(userAddress, tokenAddress);
  }

  /**
   * Get vault information
   */
  async getVaultInfo(userAddress: string) {
    const vaultAddress = await this.factoryContract.getVaultAddress(userAddress);
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.provider);
    
    return await vaultContract.getVaultInfo(userAddress);
  }

  /**
   * Check if deadline has passed
   */
  async isDeadlinePassed(userAddress: string): Promise<boolean> {
    const vaultAddress = await this.factoryContract.getVaultAddress(userAddress);
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.provider);
    
    return await vaultContract.isDeadlinePassed(userAddress);
  }

  /**
   * Get all beneficiaries for a vault
   */
  async getBeneficiaries(userAddress: string): Promise<Beneficiary[]> {
    const vaultAddress = await this.factoryContract.getVaultAddress(userAddress);
    const vaultContract = DeadManSwitchVault__factory.connect(vaultAddress, this.provider);
    
    const vaultInfo = await vaultContract.getVaultInfo(userAddress);
    const beneficiaries: Beneficiary[] = [];

    for (let i = 0; i < vaultInfo.beneficiaryCount; i++) {
      const beneficiaryInfo = await vaultContract.getBeneficiary(userAddress, i);
      beneficiaries.push({
        address: beneficiaryInfo.beneficiaryAddress,
        sharePercentage: beneficiaryInfo.sharePercentage / 100,
        name: `Beneficiary ${i + 1}`
      });
    }

    return beneficiaries;
  }

  /**
   * Monitor wallet balance
   */
  async getWalletBalance(walletAddress: string): Promise<string> {
    const balance = await this.provider.getBalance(walletAddress);
    return ethers.utils.formatEther(balance);
  }

  /**
   * Get ERC20 token balance
   */
  async getTokenBalance(
    walletAddress: string, 
    tokenAddress: string
  ): Promise<string> {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ['function balanceOf(address) view returns (uint256)'],
      this.provider
    );

    const balance = await tokenContract.balanceOf(walletAddress);
    return ethers.utils.formatEther(balance);
  }

  /**
   * Setup automated monitoring
   */
  async setupMonitoring(userAddress: string): Promise<void> {
    // This would integrate with Chainlink Automation or similar service
    // For now, we'll implement a basic monitoring system
    
    const checkDeadline = async () => {
      try {
        const isPassed = await this.isDeadlinePassed(userAddress);
        if (isPassed) {
          console.log(`Deadline passed for user ${userAddress}, transferring funds...`);
          await this.transferFundsIfDeadlinePassed(userAddress);
        }
      } catch (error) {
        console.error('Error checking deadline:', error);
      }
    };

    // Check every hour
    setInterval(checkDeadline, 60 * 60 * 1000);
  }

  /**
   * Validate wallet address
   */
  static validateAddress(address: string): boolean {
    return ethers.utils.isAddress(address);
  }

  /**
   * Validate share percentages
   */
  static validateShares(beneficiaries: Beneficiary[]): boolean {
    const totalShare = beneficiaries.reduce((sum, b) => sum + b.sharePercentage, 0);
    return totalShare === 100 && beneficiaries.every(b => b.sharePercentage > 0);
  }
}

// Utility functions for wallet management
export class WalletUtils {
  /**
   * Generate a new wallet
   */
  static generateWallet(): { address: string; privateKey: string } {
    const wallet = ethers.Wallet.createRandom();
    return {
      address: wallet.address,
      privateKey: wallet.privateKey
    };
  }

  /**
   * Encrypt private key
   */
  static async encryptPrivateKey(
    privateKey: string, 
    password: string
  ): Promise<string> {
    const wallet = new ethers.Wallet(privateKey);
    return await wallet.encrypt(password);
  }

  /**
   * Decrypt private key
   */
  static async decryptPrivateKey(
    encryptedKey: string, 
    password: string
  ): Promise<string> {
    const wallet = await ethers.Wallet.fromEncryptedJson(encryptedKey, password);
    return wallet.privateKey;
  }

  /**
   * Get wallet from mnemonic
   */
  static getWalletFromMnemonic(mnemonic: string, path: string = "m/44'/60'/0'/0/0"): ethers.Wallet {
    return ethers.Wallet.fromMnemonic(mnemonic, path);
  }

  /**
   * Validate mnemonic
   */
  static validateMnemonic(mnemonic: string): boolean {
    return ethers.utils.isValidMnemonic(mnemonic);
  }
}
