"use client";
import { CheckCircle, Clock, Users, Coins, AlertTriangle } from "lucide-react";

interface DeploymentSummaryProps {
  frequency: number;
  grace: number;
  depositEth: string;
  beneficiaries: { account: string; bps: number }[];
  totalBps: number;
}

export default function DeploymentSummary({ 
  frequency, 
  grace, 
  depositEth, 
  beneficiaries, 
  totalBps 
}: DeploymentSummaryProps) {
  const formatFrequency = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  const formatGracePeriod = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} days`;
    return `${days} days, ${remainingHours} hours`;
  };

  const getNextDeadline = () => {
    const now = new Date();
    const deadline = new Date(now.getTime() + (frequency + grace) * 1000);
    return deadline.toLocaleDateString() + ' ' + deadline.toLocaleTimeString();
  };

  const isValid = totalBps === 10000 && 
                  beneficiaries.every(b => b.account && b.bps > 0) &&
                  parseFloat(depositEth) > 0;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium flex items-center gap-2">
        <CheckCircle className="w-5 h-5 text-green-600" />
        Deployment Summary
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frequency */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Check-in Frequency</span>
          </div>
          <p className="text-lg font-semibold text-blue-600">{formatFrequency(frequency)}</p>
          <p className="text-sm text-gray-600">You must check in every {formatFrequency(frequency)}</p>
        </div>

        {/* Grace Period */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="font-medium">Grace Period</span>
          </div>
          <p className="text-lg font-semibold text-orange-600">{formatGracePeriod(grace)}</p>
          <p className="text-sm text-gray-600">Extra time after missing check-in</p>
        </div>

        {/* Deposit */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-green-600" />
            <span className="font-medium">Initial Deposit</span>
          </div>
          <p className="text-lg font-semibold text-green-600">{depositEth} ETH</p>
          <p className="text-sm text-gray-600">Funds locked in the vault</p>
        </div>

        {/* Beneficiaries */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-purple-600" />
            <span className="font-medium">Beneficiaries</span>
          </div>
          <p className="text-lg font-semibold text-purple-600">{beneficiaries.length}</p>
          <p className="text-sm text-gray-600">People who will receive funds</p>
        </div>
      </div>

      {/* Beneficiaries List */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium mb-3">Beneficiary Details</h4>
        <div className="space-y-2">
          {beneficiaries.map((beneficiary, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="font-mono text-sm">{beneficiary.account}</span>
              <span className="text-sm font-medium">{beneficiary.bps} bps ({(beneficiary.bps / 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Allocation</span>
            <span className={`text-sm font-bold ${totalBps === 10000 ? 'text-green-600' : 'text-red-600'}`}>
              {totalBps}/10000 bps
            </span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="p-4 border border-gray-200 rounded-lg bg-blue-50">
        <h4 className="font-medium mb-3 text-blue-800">Timeline</h4>
        <div className="space-y-2 text-sm text-blue-700">
          <p>• <strong>First check-in deadline:</strong> {getNextDeadline()}</p>
          <p>• <strong>Total time until execution:</strong> {formatFrequency(frequency)} + {formatGracePeriod(grace)}</p>
          <p>• <strong>Action required:</strong> Check in before the deadline to reset the timer</p>
        </div>
      </div>

      {/* Validation */}
      <div className={`p-4 rounded-lg border ${
        isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
      }`}>
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-600" />
          )}
          <span className={`font-medium ${isValid ? 'text-green-800' : 'text-red-800'}`}>
            {isValid ? 'Ready to Deploy' : 'Configuration Issues'}
          </span>
        </div>
        
        {isValid ? (
          <p className="text-sm text-green-700 mt-2">
            All settings are valid. You can proceed with deployment.
          </p>
        ) : (
          <div className="text-sm text-red-700 mt-2 space-y-1">
            {totalBps !== 10000 && <p>• Beneficiary allocation must equal 10000 bps (currently {totalBps})</p>}
            {beneficiaries.some(b => !b.account) && <p>• All beneficiaries must have valid addresses</p>}
            {beneficiaries.some(b => b.bps <= 0) && <p>• All beneficiaries must have positive basis points</p>}
            {parseFloat(depositEth) <= 0 && <p>• Initial deposit must be greater than 0</p>}
          </div>
        )}
      </div>
    </div>
  );
}






