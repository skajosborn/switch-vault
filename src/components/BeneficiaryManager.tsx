"use client";
import { useState } from "react";
import { X, Plus, User, Percent } from "lucide-react";

interface Beneficiary {
  account: string;
  bps: number;
}

interface BeneficiaryManagerProps {
  beneficiaries: Beneficiary[];
  onChange: (beneficiaries: Beneficiary[]) => void;
}

export default function BeneficiaryManager({ beneficiaries, onChange }: BeneficiaryManagerProps) {
  const [newAccount, setNewAccount] = useState("");
  const [newBps, setNewBps] = useState("");

  const totalBps = beneficiaries.reduce((sum, b) => sum + Number(b.bps || 0), 0);
  const remainingBps = 10000 - totalBps;

  const addBeneficiary = () => {
    if (!newAccount || !newBps || Number(newBps) <= 0) return;
    if (Number(newBps) > remainingBps) {
      alert(`Cannot add ${newBps} bps. Only ${remainingBps} bps remaining.`);
      return;
    }

    const newBeneficiary = {
      account: newAccount.trim(),
      bps: Number(newBps)
    };

    onChange([...beneficiaries, newBeneficiary]);
    setNewAccount("");
    setNewBps("");
  };

  const removeBeneficiary = (index: number) => {
    onChange(beneficiaries.filter((_, i) => i !== index));
  };

  const updateBeneficiary = (index: number, field: keyof Beneficiary, value: string | number) => {
    const updated = [...beneficiaries];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Beneficiaries</h3>
        <div className="text-sm text-gray-600">
          Total: <span className={`font-medium ${totalBps === 10000 ? 'text-green-600' : 'text-red-600'}`}>
            {totalBps}/10000 bps
          </span>
        </div>
      </div>

      {/* Add new beneficiary */}
      <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Address
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="0x..."
                value={newAccount}
                onChange={(e) => setNewAccount(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg ${
                  newAccount && !isValidAddress(newAccount) ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {newAccount && !isValidAddress(newAccount) && (
              <p className="text-xs text-red-500 mt-1">Invalid Ethereum address</p>
            )}
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Basis Points
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="number"
                placeholder="bps"
                min="1"
                max={remainingBps}
                value={newBps}
                onChange={(e) => setNewBps(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{remainingBps} bps remaining</p>
          </div>
          <button
            onClick={addBeneficiary}
            disabled={!newAccount || !newBps || Number(newBps) <= 0 || Number(newBps) > remainingBps || !isValidAddress(newAccount)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </div>
      </div>

      {/* Existing beneficiaries */}
      <div className="space-y-3">
        {beneficiaries.map((beneficiary, index) => (
          <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50">
            <div className="flex-1">
              <input
                type="text"
                value={beneficiary.account}
                onChange={(e) => updateBeneficiary(index, 'account', e.target.value)}
                className={`w-full px-3 py-2 border rounded ${
                  !isValidAddress(beneficiary.account) ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0x..."
              />
              {!isValidAddress(beneficiary.account) && (
                <p className="text-xs text-red-500 mt-1">Invalid address</p>
              )}
            </div>
            <div className="w-24">
              <input
                type="number"
                value={beneficiary.bps}
                onChange={(e) => updateBeneficiary(index, 'bps', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                min="1"
                max="10000"
              />
            </div>
            <div className="w-20 text-sm text-gray-600 text-center">
              {((beneficiary.bps / 10000) * 100).toFixed(1)}%
            </div>
            <button
              onClick={() => removeBeneficiary(index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Allocation Progress</span>
          <span>{totalBps}/10000 bps</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              totalBps === 10000 ? 'bg-green-500' : totalBps > 10000 ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min((totalBps / 10000) * 100, 100)}%` }}
          />
        </div>
        {totalBps < 10000 && (
          <p className="text-sm text-gray-600">
            {remainingBps} basis points remaining to allocate
          </p>
        )}
        {totalBps > 10000 && (
          <p className="text-sm text-red-600">
            {totalBps - 10000} basis points over allocated
          </p>
        )}
      </div>
    </div>
  );
}






