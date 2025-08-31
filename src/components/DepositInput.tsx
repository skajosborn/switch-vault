"use client";
import { useState } from "react";
import { Coins, Info, AlertTriangle } from "lucide-react";

interface DepositInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DepositInput({ value, onChange }: DepositInputProps) {
  const [showCustom, setShowCustom] = useState(false);

  const presetAmounts = [
    { label: "0.01 ETH", value: "0.01", description: "Minimal deposit" },
    { label: "0.05 ETH", value: "0.05", description: "Small amount" },
    { label: "0.1 ETH", value: "0.1", description: "Standard deposit" },
    { label: "0.5 ETH", value: "0.5", description: "Medium amount" },
    { label: "1 ETH", value: "1", description: "Large deposit" },
    { label: "5 ETH", value: "5", description: "Significant amount" },
  ];

  const handlePresetClick = (amount: string) => {
    onChange(amount);
    setShowCustom(false);
  };

  const getDepositLevel = (eth: string) => {
    const num = parseFloat(eth);
    if (num < 0.1) return { level: 'low', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
    if (num < 1) return { level: 'medium', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' };
    return { level: 'high', color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' };
  };

  const depositInfo = getDepositLevel(value);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Coins className="w-5 h-5 text-gray-600" />
        <span className="text-lg font-medium">Initial Deposit</span>
      </div>

      <p className="text-sm text-gray-600">
        This is the amount of ETH that will be locked in your vault. You can add more later, but this initial amount will be used to fund the vault.
      </p>

      {/* Preset amounts */}
      <div className="grid grid-cols-2 gap-3">
        {presetAmounts.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`p-4 text-left border rounded-lg transition-all hover:shadow-md ${
              value === preset.value
                ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">{preset.label}</div>
            <div className="text-sm text-gray-600">{preset.description}</div>
          </button>
        ))}
      </div>

      {/* Custom amount */}
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showCustom}
            onChange={(e) => setShowCustom(e.target.checked)}
            className="rounded"
          />
          Custom amount
        </label>
      </div>

      {showCustom && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (ETH)</label>
              <input
                type="number"
                step="0.001"
                min="0.001"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
                placeholder="0.1"
              />
            </div>
            <div className="text-sm text-gray-600">
              ≈ ${(parseFloat(value || '0') * 2000).toFixed(2)} USD
            </div>
          </div>
        </div>
      )}

      {/* Current deposit display */}
      <div className={`p-4 rounded-lg border ${depositInfo.border} ${depositInfo.bg}`}>
        <div className="flex items-center gap-2">
          <Coins className={`w-5 h-5 ${depositInfo.color}`} />
          <span className="font-medium">Current Deposit:</span>
          <span className={depositInfo.color}>{value} ETH</span>
        </div>
        
        {parseFloat(value) < 0.01 && (
          <div className="flex items-center gap-2 mt-2 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Very small deposit - consider increasing for meaningful impact</span>
          </div>
        )}
      </div>

      {/* Important information */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Important Notes:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>This amount will be locked in the smart contract</li>
              <li>You'll need additional ETH for gas fees (typically 0.001-0.01 ETH)</li>
              <li>You can add more funds to the vault after deployment</li>
              <li>Funds are only distributed if you don't check in on time</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Gas cost estimate */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• <strong>Deployment gas:</strong> ~0.005-0.015 ETH (varies by network)</p>
        <p>• <strong>Check-in gas:</strong> ~0.001-0.003 ETH per check-in</p>
        <p>• <strong>Total estimated cost:</strong> ~{(parseFloat(value || '0') + 0.02).toFixed(3)} ETH (including gas)</p>
      </div>
    </div>
  );
}






