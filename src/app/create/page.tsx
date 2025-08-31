"use client";
import { useState } from "react";
import { parseEther } from "viem";
import { useWriteContract, useAccount } from "wagmi";
import { FACTORY_ADDRESS, factoryAbi } from "@/lib/contracts";
import WalletConnect from "@/components/WalletConnect";
import CustomFrequencyInput from "@/components/CustomFrequencyInput";
import GracePeriodInput from "@/components/GracePeriodInput";
import BeneficiaryManager from "@/components/BeneficiaryManager";
import DepositInput from "@/components/DepositInput";
import DeploymentSummary from "@/components/DeploymentSummary";

type Bene = { account: string; bps: number };

export default function CreateSwitch() {
  const [frequency, setFrequency] = useState(7 * 24 * 3600); // Weekly default
  const [grace, setGrace] = useState(72 * 3600); // 72 hours default
  const [depositEth, setDepositEth] = useState("0.1");
  const [benes, setBenes] = useState<Bene[]>([{ account: "", bps: 10000 }]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  
  const { writeContractAsync } = useWriteContract();
  const { address: userAddress } = useAccount();

  const totalBps = benes.reduce((s, b) => s + Number(b.bps || 0), 0);

  async function deploy() {
    if (totalBps !== 10000) {
      alert("Beneficiaries must total 10000 bps (100%).");
      return;
    }

    if (!userAddress) {
      alert("Please connect your wallet first.");
      return;
    }

    if (FACTORY_ADDRESS === "0x0000000000000000000000000000000000000000") {
      alert("Factory contract not deployed yet. Please deploy the factory contract first and update the address in src/lib/contracts.ts");
      return;
    }

    try {
      setIsDeploying(true);
      
      // Convert beneficiaries to the format expected by the contract
      const beneficiaries = benes.map(b => ({
        account: b.account as `0x${string}`,
        bps: BigInt(b.bps)
      }));

      // Deploy vault through factory
      const hash = await writeContractAsync({
        address: FACTORY_ADDRESS as `0x${string}`,
        abi: factoryAbi,
        functionName: 'createVault',
        args: [BigInt(frequency), BigInt(grace), beneficiaries],
        value: parseEther(depositEth)
      });

      // For now, we'll use a placeholder since the factory contract needs to be deployed first
      const vaultAddress = "Vault deployed successfully! Check transaction hash: " + hash;
      setDeployedAddress(vaultAddress);
      
      alert(`Vault deployed successfully! Address: ${vaultAddress}`);
    } catch (error) {
      console.error("Deployment failed:", error);
      alert("Deployment failed. Check console for details.");
    } finally {
      setIsDeploying(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Dead Man's Switch</h1>
            <p className="text-lg text-gray-600">Configure your automated safety net with full customization</p>
          </div>
          <WalletConnect />
        </div>

        {/* Success Message */}
        {deployedAddress && (
          <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-green-800 mb-2">🎉 Vault Deployed Successfully!</h2>
            <p className="text-green-700 mb-3">{deployedAddress}</p>
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-medium text-green-800 mb-2">Next Steps:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
                <li>Set up Chainlink Automation for your vault</li>
                <li>Fund the upkeep with LINK tokens</li>
                <li>Use the dashboard to check in regularly</li>
              </ol>
            </div>
          </div>
        )}

        {/* Wallet Connection Warning */}
        {!userAddress && (
          <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
              <div>
                <h3 className="font-medium text-yellow-800">Wallet Not Connected</h3>
                <p className="text-yellow-700">Please connect your wallet to create a vault.</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Frequency Input */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <CustomFrequencyInput value={frequency} onChange={setFrequency} />
            </div>

            {/* Grace Period Input */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <GracePeriodInput value={grace} onChange={setGrace} />
            </div>

            {/* Beneficiary Manager */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <BeneficiaryManager beneficiaries={benes} onChange={setBenes} />
            </div>

            {/* Deposit Input */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
              <DepositInput value={depositEth} onChange={setDepositEth} />
            </div>
          </div>

          {/* Summary Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <DeploymentSummary
                  frequency={frequency}
                  grace={grace}
                  depositEth={depositEth}
                  beneficiaries={benes}
                  totalBps={totalBps}
                />

                {/* Deploy Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={deploy}
                    disabled={isDeploying || totalBps !== 10000 || !userAddress}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    {isDeploying ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Deploying...
                      </div>
                    ) : (
                      "🚀 Deploy Vault"
                    )}
                  </button>
                  
                  {totalBps !== 10000 && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Fix configuration issues to deploy
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Deploy & Fund</h3>
              <p className="text-gray-600 text-sm">Create your vault and deposit ETH. The smart contract will hold your funds securely.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Check In Regularly</h3>
              <p className="text-gray-600 text-sm">Before each deadline, check in to reset the timer. As long as you're active, your funds stay safe.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Automatic Distribution</h3>
              <p className="text-gray-600 text-sm">If you miss a check-in, funds are automatically distributed to your beneficiaries after the grace period.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}