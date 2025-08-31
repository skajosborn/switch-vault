"use client";
import { useState } from "react";
import { useAccount } from "wagmi";
import { Shield, Clock, Coins, Users, CheckCircle, AlertTriangle, Plus } from "lucide-react";
import WalletConnect from "@/components/WalletConnect";

// Mock data - replace with actual contract calls
const mockVaults = [
  {
    address: "0x1234...5678",
    frequency: "Weekly",
    gracePeriod: "72 hours",
    lastCheckIn: "2024-01-15 10:30 AM",
    nextDeadline: "2024-01-22 10:30 AM",
    balance: "0.5 ETH",
    beneficiaries: 3,
    status: "active" as const,
  },
  {
    address: "0x8765...4321",
    frequency: "Monthly",
    gracePeriod: "1 week",
    lastCheckIn: "2024-01-01 2:00 PM",
    nextDeadline: "2024-02-01 2:00 PM",
    balance: "2.0 ETH",
    beneficiaries: 2,
    status: "warning" as const,
  },
];

export default function VaultPage() {
  const { address: userAddress } = useAccount();
  const [vaults] = useState(mockVaults);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'expired': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Vaults</h1>
            <p className="text-lg text-gray-600">Manage your deployed dead man's switches</p>
          </div>
          <WalletConnect />
        </div>

        {/* Wallet Connection Warning */}
        {!userAddress && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
              <div>
                <h3 className="font-medium text-yellow-800">Wallet Not Connected</h3>
                <p className="text-yellow-700">Please connect your wallet to view your vaults.</p>
              </div>
            </div>
          </div>
        )}

        {/* Vaults Grid */}
        {userAddress && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {vaults.map((vault, index) => {
              const StatusIcon = getStatusIcon(vault.status);
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Vault #{index + 1}</h3>
                        <p className="text-sm text-gray-500 font-mono">{vault.address}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(vault.status)}`}>
                      <div className="flex items-center gap-1">
                        <StatusIcon className="w-3 h-3" />
                        {vault.status.charAt(0).toUpperCase() + vault.status.slice(1)}
                      </div>
                    </div>
                  </div>

                  {/* Vault Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium">{vault.frequency}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Grace Period:</span>
                      <span className="font-medium">{vault.gracePeriod}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Coins className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Balance:</span>
                      <span className="font-medium">{vault.balance}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Beneficiaries:</span>
                      <span className="font-medium">{vault.beneficiaries}</span>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Timeline</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Check-in:</span>
                        <span className="font-medium">{vault.lastCheckIn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Deadline:</span>
                        <span className="font-medium">{vault.nextDeadline}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Check In
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {userAddress && vaults.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vaults Found</h3>
            <p className="text-gray-600 mb-6">You haven't deployed any vaults yet.</p>
            <a
              href="/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Create Your First Vault
            </a>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Vault Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Regular Check-ins</h3>
              <p className="text-gray-600 text-sm">Check in before each deadline to keep your vault active and funds safe.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Add Funds</h3>
              <p className="text-gray-600 text-sm">You can add more ETH to your vault at any time to increase the potential payout.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Update Beneficiaries</h3>
              <p className="text-gray-600 text-sm">Modify your beneficiary list or allocation percentages as needed.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


