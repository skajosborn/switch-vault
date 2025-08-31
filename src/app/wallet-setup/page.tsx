'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Plus, Trash2, Copy, Check, AlertTriangle, Shield, Key, ExternalLink } from 'lucide-react';
import { walletConnector, WalletConnector } from '@/lib/walletConnector';

interface WalletAddress {
  id: string;
  name: string;
  address: string;
  network: string;
  type: 'recovery' | 'distribution' | 'backup';
}

export default function WalletSetupPage() {
  const router = useRouter();
  const [walletAddresses, setWalletAddresses] = useState<WalletAddress[]>([
    {
      id: '1',
      name: 'Main Recovery Wallet',
      address: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
      network: 'ethereum',
      type: 'recovery'
    },
    {
      id: '2',
      name: 'Distribution Wallet',
      address: '0x8ba1f109551bD432803012645Hac136c772c7cb',
      network: 'polygon',
      type: 'distribution'
    }
  ]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWallet, setNewWallet] = useState({
    name: '',
    address: '',
    network: 'ethereum',
    type: 'recovery' as const
  });

  const networks = [
    { id: 'ethereum', name: 'Ethereum', icon: '🔵' },
    { id: 'bitcoin', name: 'Bitcoin', icon: '🟡' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔵' },
    { id: 'optimism', name: 'Optimism', icon: '🔴' },
    { id: 'binance', name: 'BNB Chain', icon: '🟡' }
  ];

  const walletTypes = [
    { id: 'recovery', name: 'Recovery Wallet', description: 'Primary wallet for asset recovery' },
    { id: 'distribution', name: 'Distribution Wallet', description: 'Wallet for distributing assets to beneficiaries' },
    { id: 'backup', name: 'Backup Wallet', description: 'Secondary backup wallet' }
  ];

  // Set client-side flag and check wallet connection
  useEffect(() => {
    setIsClient(true);
    
    const checkConnection = async () => {
      if (walletConnector.isConnected()) {
        setIsConnected(true);
        const info = await walletConnector.getWalletInfo();
        setWalletInfo(info);
      }
    };
    
    checkConnection();
  }, []);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (!WalletConnector.isMetaMaskInstalled()) {
        throw new Error('MetaMask is not installed. Please install MetaMask and try again.');
      }

      const connection = await walletConnector.connectMetaMask();
      setIsConnected(true);
      
      // Get wallet info
      const info = await walletConnector.getWalletInfo();
      setWalletInfo(info);
      
      // Auto-add the connected wallet to the list
      if (info) {
        const connectedWallet: WalletAddress = {
          id: Date.now().toString(),
          name: 'Connected Wallet',
          address: info.address,
          network: info.network.toLowerCase().replace(' ', '-'),
          type: 'recovery'
        };
        
        setWalletAddresses(prev => {
          // Check if wallet already exists
          const exists = prev.some(w => w.address.toLowerCase() === info.address.toLowerCase());
          if (!exists) {
            return [...prev, connectedWallet];
          }
          return prev;
        });
      }
      
      console.log('Wallet connected successfully:', connection);
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      setError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAddWallet = () => {
    if (newWallet.name && newWallet.address) {
      const wallet: WalletAddress = {
        id: Date.now().toString(),
        ...newWallet
      };
      setWalletAddresses(prev => [...prev, wallet]);
      setNewWallet({ name: '', address: '', network: 'ethereum', type: 'recovery' });
      setShowAddForm(false);
    }
  };

  const handleRemoveWallet = (id: string) => {
    setWalletAddresses(prev => prev.filter(wallet => wallet.id !== id));
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy address:', error);
    }
  };

  const handleBack = () => {
    router.push('/setup');
  };

  const handleContinue = () => {
    // Here you would save the wallet configuration and proceed
    router.push('/create-switch?type=wallet');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 bg-opacity-20 rounded-lg border border-opacity-30">
                <Wallet className="w-6 h-6 text-green-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Wallet Setup</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Configure Your Crypto Wallets
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Set up designated wallet addresses for asset recovery and distribution. 
              Connect your existing wallets or add addresses manually.
            </p>
          </div>

          {/* Wallet Connection Section */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-green-600/20 rounded-lg border border-green-600/30">
                <Key className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Connect Your Wallet</h3>
            </div>
            
            {error && (
              <div className="bg-red-900/20 border border-red-600/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-red-400 mb-1">Connection Error</h4>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            {isClient && isConnected && walletInfo ? (
              <div className="bg-green-900/20 border border-green-600/30 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 rounded-lg">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-400">Wallet Connected</h4>
                      <p className="text-green-200 text-sm">{walletInfo.network}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      walletConnector.disconnect();
                      setIsConnected(false);
                      setWalletInfo(null);
                    }}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Address</div>
                    <div className="font-mono text-sm text-white break-all">
                      {walletInfo.address}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="text-xs text-slate-400 mb-1">Balance</div>
                    <div className="text-sm text-white font-medium">
                      {parseFloat(walletInfo.balance).toFixed(4)} ETH
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2 text-sm text-green-200">
                  <Check className="w-4 h-4" />
                  Wallet automatically added to your designated addresses
                </div>
              </div>
            ) : !isClient ? (
              <div className="text-center py-8">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-300">Loading...</p>
              </div>
            ) : (
              <>
                <p className="text-slate-300 mb-6">
                  Connect your existing wallet to automatically import addresses and manage your assets securely.
                </p>
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Wallet className="w-5 h-5" />
                      Connect Wallet
                    </>
                  )}
                </button>
                
                {isClient && !WalletConnector.isMetaMaskInstalled() && (
                  <div className="mt-4 text-center">
                    <p className="text-slate-400 text-sm mb-2">Don't have MetaMask?</p>
                    <a
                      href="https://metamask.io/download/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Download MetaMask
                    </a>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Manual Wallet Addition */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-600/30">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Designated Wallet Addresses</h3>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Wallet
              </button>
            </div>

            {/* Add Wallet Form */}
            {showAddForm && (
              <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-6">
                <h4 className="text-lg font-semibold text-white mb-4">Add New Wallet Address</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Name</label>
                    <input
                      type="text"
                      value={newWallet.name}
                      onChange={(e) => setNewWallet(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="My Recovery Wallet"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Network</label>
                    <select
                      value={newWallet.network}
                      onChange={(e) => setNewWallet(prev => ({ ...prev, network: e.target.value }))}
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      {networks.map(network => (
                        <option key={network.id} value={network.id}>
                          {network.icon} {network.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {walletTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setNewWallet(prev => ({ ...prev, type: type.id as any }))}
                        className={`p-3 rounded-lg border transition-colors text-left ${
                          newWallet.type === type.id
                            ? 'border-blue-500 bg-blue-600/20'
                            : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                        }`}
                      >
                        <div className="font-medium text-white">{type.name}</div>
                        <div className="text-sm text-slate-400">{type.description}</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={newWallet.address}
                    onChange={(e) => setNewWallet(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="0x..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleAddWallet}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Wallet
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Wallet List */}
            <div className="space-y-4">
              {walletAddresses.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400">No wallet addresses added yet</p>
                  <p className="text-sm text-slate-500">Add your first wallet address to get started</p>
                </div>
              ) : (
                walletAddresses.map(wallet => (
                  <div key={wallet.id} className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-600 rounded-lg">
                          <Wallet className="w-5 h-5 text-slate-300" />
                        </div>
                        <div>
                          <div className="font-medium text-white">{wallet.name}</div>
                          <div className="text-sm text-slate-400">
                            {networks.find(n => n.id === wallet.network)?.name} • {walletTypes.find(t => t.id === wallet.type)?.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopyAddress(wallet.address)}
                          className="p-2 text-slate-400 hover:text-white transition-colors"
                          title="Copy address"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveWallet(wallet.id)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Remove wallet"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                      <div className="text-xs text-slate-400 mb-1">Address</div>
                      <div className="font-mono text-sm text-slate-300 break-all">
                        {wallet.address}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-900/20 border border-amber-600/30 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-400 mb-2">Security Notice</h4>
                <p className="text-amber-200 text-sm leading-relaxed">
                  Your wallet addresses and private keys are encrypted and stored securely. 
                  Only designated beneficiaries will have access to these wallets if you don't check in. 
                  Never share your private keys or recovery phrases with anyone.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleBack}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-600/30"
            >
              Back to Setup
            </button>
            <button
              onClick={handleContinue}
              disabled={walletAddresses.length === 0}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Switch Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
