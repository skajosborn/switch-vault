import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

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

export function useWalletSetup() {
  const { token } = useAuth();
  const [walletSetup, setWalletSetup] = useState<WalletSetup>({
    mainWallet: '',
    beneficiaries: [],
    backupWallet: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load wallet setup from API
  const loadWalletSetup = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet-setup', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load wallet setup');
      }

      const data = await response.json();
      setWalletSetup(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save wallet setup to API
  const saveWalletSetup = async (setup: WalletSetup) => {
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet-setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(setup),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save wallet setup');
      }

      setWalletSetup(setup);
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete wallet setup
  const deleteWalletSetup = async () => {
    if (!token) {
      setError('Not authenticated');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet-setup', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete wallet setup');
      }

      setWalletSetup({
        mainWallet: '',
        beneficiaries: [],
        backupWallet: '',
      });
      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Load wallet setup on mount if authenticated
  useEffect(() => {
    if (token) {
      loadWalletSetup();
    }
  }, [token]);

  return {
    walletSetup,
    loading,
    error,
    saveWalletSetup,
    loadWalletSetup,
    deleteWalletSetup,
  };
}
