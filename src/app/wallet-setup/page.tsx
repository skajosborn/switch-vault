'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, Plus, Trash2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWalletSetup } from '@/hooks/useWalletSetup';

interface Beneficiary {
  id: string;
  name: string;
  walletAddress: string;
  percentage: number;
  email?: string;
  phone?: string;
}

interface WalletSetup {
  mainWallet: string;
  beneficiaries: Beneficiary[];
  backupWallet?: string;
}

export default function WalletSetupPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const { walletSetup, loading, error: apiError, saveWalletSetup } = useWalletSetup();
  
  // Wallet connection state
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Use database state instead of localStorage
  const [setup, setSetup] = useState<WalletSetup>(walletSetup);
  
  const [newBeneficiary, setNewBeneficiary] = useState({
    name: '',
    walletAddress: '',
    percentage: 0,
    email: '',
    phone: ''
  });
  
  const [expandedSections, setExpandedSections] = useState({
    mainWallet: true,
    beneficiaries: true,
    backupWallet: false
  });

  // Update local state when database data changes
  useEffect(() => {
    setSetup(walletSetup);
  }, [walletSetup]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !token) {
      router.push('/auth/login');
    }
  }, [token, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error if API error occurs
  if (apiError) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
            <p className="text-red-400 mb-4">Error loading wallet setup: {apiError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    
    try {
      if (typeof window === 'undefined') {
        setError('Browser environment not available.');
        return;
      }
      
      if (!window.ethereum) {
        setError('MetaMask is not installed. Please install MetaMask to continue.');
        return;
      }
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        setIsConnected(true);
        const updatedSetup = { ...setup, mainWallet: address };
        setSetup(updatedSetup);
        await saveWalletSetup(updatedSetup);
      } else {
        setError('No accounts found. Please unlock MetaMask and try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const handleAddBeneficiary = async () => {
    if (newBeneficiary.name && newBeneficiary.walletAddress && newBeneficiary.percentage > 0) {
      const beneficiary: Beneficiary = {
        id: Date.now().toString(),
        ...newBeneficiary
      };
      
      const updatedSetup = {
        ...setup,
        beneficiaries: [...setup.beneficiaries, beneficiary]
      };
      
      const success = await saveWalletSetup(updatedSetup);
      if (success) {
        setSetup(updatedSetup);
        setNewBeneficiary({
          name: '',
          walletAddress: '',
          percentage: 0,
          email: '',
          phone: ''
        });
      }
    }
  };

  const handleRemoveBeneficiary = async (id: string) => {
    const updatedSetup = {
      ...setup,
      beneficiaries: setup.beneficiaries.filter(b => b.id !== id)
    };
    
    const success = await saveWalletSetup(updatedSetup);
    if (success) {
      setSetup(updatedSetup);
    }
  };

  const clearSavedData = () => {
    // Data is now managed by the database, no need to clear localStorage
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getTotalPercentage = () => {
    return setup.beneficiaries.reduce((sum, beneficiary) => sum + beneficiary.percentage, 0);
  };

  const canContinue = setup.mainWallet && setup.beneficiaries.length > 0 && getTotalPercentage() === 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/setup')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Your Wallet</h1>
          <p className="text-slate-400">Configure where your assets are stored and who should receive them.</p>
        </div>

        {/* Connect Wallet Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Connect Your Wallet</h2>
          </div>
          
          {isConnected ? (
            <div className="text-center py-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Check className="w-6 h-6 text-green-500" />
                <span className="text-green-400 font-medium">Wallet Connected</span>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 mb-4">
                <p className="text-slate-300 text-sm mb-2">Connected Address:</p>
                <div className="flex items-center gap-2 justify-center">
                  <code className="text-blue-400 font-mono text-sm">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </code>
                  <button
                    onClick={() => handleCopyAddress(walletAddress)}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <Wallet className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Connect your wallet to automatically fill in your main wallet address</p>
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 mx-auto"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
              {error && (
                <p className="text-red-400 text-sm mt-2">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* Main Wallet Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
          <button
            onClick={() => toggleSection('mainWallet')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">Your Main Wallet</h2>
              <p className="text-slate-400 text-sm">Where are your assets currently stored?</p>
            </div>
            {expandedSections.mainWallet ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.mainWallet && (
            <div className="px-6 pb-6">
              <p className="text-slate-300 mb-4">
                This is the wallet we'll monitor for your assets. If you don't connect one, you can enter a wallet address manually.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
                <input
                  type="text"
                  value={setup.mainWallet}
                  onChange={(e) => {
                    const updatedSetup = { ...setup, mainWallet: e.target.value };
                    setSetup(updatedSetup);
                    saveWalletSetup(updatedSetup);
                  }}
                  placeholder="0x..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Beneficiaries Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
          <button
            onClick={() => toggleSection('beneficiaries')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">Add Beneficiaries</h2>
              <p className="text-slate-400 text-sm">Who should receive your assets?</p>
            </div>
            {expandedSections.beneficiaries ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.beneficiaries && (
            <div className="px-6 pb-6">
              <p className="text-slate-300 mb-4">
                When the dead man's switch activates, these wallets will receive the assets according to the percentages you set.
              </p>
              
              {/* Add New Beneficiary Form */}
              <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                <h4 className="font-medium text-white mb-4">Add New Beneficiary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={newBeneficiary.name}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Alice Johnson"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Percentage *</label>
                    <input
                      type="number"
                      value={newBeneficiary.percentage}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, percentage: Number(e.target.value) }))}
                      placeholder="50"
                      min="1"
                      max="100"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address *</label>
                    <input
                      type="text"
                      value={newBeneficiary.walletAddress}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, walletAddress: e.target.value }))}
                      placeholder="0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email (optional)</label>
                    <input
                      type="email"
                      value={newBeneficiary.email}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="alice@email.com"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      value={newBeneficiary.phone}
                      onChange={(e) => setNewBeneficiary(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 123-4567"
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAddBeneficiary}
                  disabled={!newBeneficiary.name || !newBeneficiary.walletAddress || newBeneficiary.percentage <= 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Add Beneficiary
                </button>
              </div>

              {/* Existing Beneficiaries */}
              {setup.beneficiaries.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium text-white mb-4">Current Beneficiaries</h4>
                  <div className="space-y-3">
                    {setup.beneficiaries.map((beneficiary) => (
                      <div key={beneficiary.id} className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="font-medium text-white">{beneficiary.name}</h5>
                            <p className="text-slate-400 text-sm">{beneficiary.percentage}%</p>
                            <p className="text-slate-400 text-sm font-mono">{beneficiary.walletAddress}</p>
                          </div>
                          <button
                            onClick={() => handleRemoveBeneficiary(beneficiary.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <p className="text-slate-400 text-sm">
                      Total: {getTotalPercentage()}% {getTotalPercentage() !== 100 && '(Must equal 100%)'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Backup Wallet Section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl mb-6">
          <button
            onClick={() => toggleSection('backupWallet')}
            className="w-full p-6 text-left flex items-center justify-between hover:bg-slate-700/50 transition-colors"
          >
            <div>
              <h2 className="text-xl font-semibold text-white">Optional Backup Wallet</h2>
              <p className="text-slate-400 text-sm">Add a backup destination (optional)</p>
            </div>
            {expandedSections.backupWallet ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {expandedSections.backupWallet && (
            <div className="px-6 pb-6">
              <p className="text-slate-300 mb-4">
                If we can't reach your beneficiaries' wallets, we'll send assets here instead.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Backup Wallet Address</label>
                <input
                  type="text"
                  value={setup.backupWallet || ''}
                  onChange={(e) => {
                    const updatedSetup = { ...setup, backupWallet: e.target.value };
                    setSetup(updatedSetup);
                    saveWalletSetup(updatedSetup);
                  }}
                  placeholder="0x..."
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={() => {
              clearSavedData(); // Clear saved data when setup is complete
              router.push('/create-switch');
            }}
            disabled={!canContinue}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
          >
            {canContinue ? 'Continue to Switch Setup' : 'Complete Setup to Continue'}
          </button>
          {!canContinue && (
            <p className="text-slate-400 text-sm mt-2">
              Please add your main wallet and beneficiaries with 100% total percentage
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
