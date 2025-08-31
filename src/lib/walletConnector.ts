import { ethers } from 'ethers';

export interface WalletConnection {
  address: string;
  provider: ethers.providers.Web3Provider;
  signer: ethers.Signer;
  chainId: number;
  network: string;
}

export interface WalletInfo {
  address: string;
  balance: string;
  network: string;
  chainId: number;
}

export class WalletConnector {
  private static instance: WalletConnector;
  private connection: WalletConnection | null = null;

  private constructor() {}

  static getInstance(): WalletConnector {
    if (!WalletConnector.instance) {
      WalletConnector.instance = new WalletConnector();
    }
    return WalletConnector.instance;
  }

  /**
   * Check if MetaMask is installed
   */
  static isMetaMaskInstalled(): boolean {
    return typeof window !== 'undefined' && window.ethereum !== undefined;
  }

  /**
   * Check if wallet is connected
   */
  isConnected(): boolean {
    return this.connection !== null;
  }

  /**
   * Get current connection
   */
  getConnection(): WalletConnection | null {
    return this.connection;
  }

  /**
   * Connect to MetaMask
   */
  async connectMetaMask(): Promise<WalletConnection> {
    try {
      if (!WalletConnector.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask and try again.');
      }

      const account = accounts[0];
      
      // Create provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      
      // Get network info
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      const networkName = this.getNetworkName(chainId);

      this.connection = {
        address: account,
        provider,
        signer,
        chainId,
        network: networkName
      };

      // Listen for account changes
      window.ethereum.on('accountsChanged', this.handleAccountsChanged.bind(this));
      
      // Listen for chain changes
      window.ethereum.on('chainChanged', this.handleChainChanged.bind(this));

      return this.connection;
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error);
      throw error;
    }
  }

  /**
   * Connect to WalletConnect
   */
  async connectWalletConnect(): Promise<WalletConnection> {
    try {
      // This would require WalletConnect v2 setup
      // For now, we'll throw an error and suggest MetaMask
      throw new Error('WalletConnect integration coming soon. Please use MetaMask for now.');
    } catch (error) {
      console.error('Failed to connect with WalletConnect:', error);
      throw error;
    }
  }

  /**
   * Disconnect wallet
   */
  disconnect(): void {
    this.connection = null;
    
    // Remove event listeners
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.removeAllListeners('accountsChanged');
      window.ethereum.removeAllListeners('chainChanged');
    }
  }

  /**
   * Get wallet information
   */
  async getWalletInfo(): Promise<WalletInfo | null> {
    if (!this.connection) {
      return null;
    }

    try {
      const balance = await this.connection.provider.getBalance(this.connection.address);
      
      return {
        address: this.connection.address,
        balance: ethers.utils.formatEther(balance),
        network: this.connection.network,
        chainId: this.connection.chainId
      };
    } catch (error) {
      console.error('Failed to get wallet info:', error);
      return null;
    }
  }

  /**
   * Switch to a specific network
   */
  async switchNetwork(chainId: number): Promise<void> {
    if (!this.connection) {
      throw new Error('No wallet connected');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error: any) {
      // If the network is not added, add it
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  /**
   * Add a network to MetaMask
   */
  async addNetwork(chainId: number): Promise<void> {
    const networkConfig = this.getNetworkConfig(chainId);
    
    if (!networkConfig) {
      throw new Error(`Network configuration not found for chainId ${chainId}`);
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkConfig]
    });
  }

  /**
   * Handle account changes
   */
  private handleAccountsChanged(accounts: string[]): void {
    if (accounts.length === 0) {
      // User disconnected
      this.disconnect();
    } else if (this.connection) {
      // Account changed
      this.connection.address = accounts[0];
    }
  }

  /**
   * Handle chain changes
   */
  private handleChainChanged(chainId: string): void {
    // Reload the page when chain changes
    window.location.reload();
  }

  /**
   * Get network name from chainId
   */
  private getNetworkName(chainId: number): string {
    switch (chainId) {
      case 1:
        return 'Ethereum Mainnet';
      case 5:
        return 'Goerli Testnet';
      case 11155111:
        return 'Sepolia Testnet';
      case 137:
        return 'Polygon';
      case 42161:
        return 'Arbitrum One';
      case 10:
        return 'Optimism';
      case 56:
        return 'BNB Chain';
      default:
        return `Chain ${chainId}`;
    }
  }

  /**
   * Get network configuration for adding to MetaMask
   */
  private getNetworkConfig(chainId: number): any {
    switch (chainId) {
      case 137: // Polygon
        return {
          chainId: '0x89',
          chainName: 'Polygon',
          nativeCurrency: {
            name: 'MATIC',
            symbol: 'MATIC',
            decimals: 18
          },
          rpcUrls: ['https://polygon-rpc.com'],
          blockExplorerUrls: ['https://polygonscan.com']
        };
      case 42161: // Arbitrum
        return {
          chainId: '0xa4b1',
          chainName: 'Arbitrum One',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://arb1.arbitrum.io/rpc'],
          blockExplorerUrls: ['https://arbiscan.io']
        };
      case 10: // Optimism
        return {
          chainId: '0xa',
          chainName: 'Optimism',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.optimism.io'],
          blockExplorerUrls: ['https://optimistic.etherscan.io']
        };
      case 56: // BNB Chain
        return {
          chainId: '0x38',
          chainName: 'BNB Chain',
          nativeCurrency: {
            name: 'BNB',
            symbol: 'BNB',
            decimals: 18
          },
          rpcUrls: ['https://bsc-dataseed.binance.org'],
          blockExplorerUrls: ['https://bscscan.com']
        };
      default:
        return null;
    }
  }

  /**
   * Get supported networks
   */
  static getSupportedNetworks() {
    return [
      { id: 1, name: 'Ethereum Mainnet', icon: '🔵' },
      { id: 5, name: 'Goerli Testnet', icon: '🟡' },
      { id: 11155111, name: 'Sepolia Testnet', icon: '🟢' },
      { id: 137, name: 'Polygon', icon: '🟣' },
      { id: 42161, name: 'Arbitrum One', icon: '🔵' },
      { id: 10, name: 'Optimism', icon: '🔴' },
      { id: 56, name: 'BNB Chain', icon: '🟡' }
    ];
  }
}

// Export a singleton instance
export const walletConnector = WalletConnector.getInstance();
