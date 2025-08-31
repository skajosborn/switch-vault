"use client";
import { useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

interface GracePeriodInputProps {
  value: number;
  onChange: (seconds: number) => void;
}

export default function GracePeriodInput({ value, onChange }: GracePeriodInputProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(72);
  const [customUnit, setCustomUnit] = useState<'hours' | 'days'>('hours');

  const presetOptions = [
    { label: "12 hours", seconds: 12 * 3600, description: "Quick response needed" },
    { label: "24 hours", seconds: 24 * 3600, description: "Standard grace period" },
    { label: "48 hours", seconds: 48 * 3600, description: "Weekend buffer" },
    { label: "72 hours", seconds: 72 * 3600, description: "3 days (recommended)" },
    { label: "1 week", seconds: 7 * 24 * 3600, description: "Extended buffer" },
    { label: "2 weeks", seconds: 14 * 24 * 3600, description: "Maximum safety" },
  ];

  const handleCustomChange = () => {
    let seconds = customValue;
    if (customUnit === 'days') {
      seconds *= 24;
    }
    onChange(seconds * 3600);
  };

  const formatGracePeriod = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    if (hours < 24) return `${hours} hours`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (remainingHours === 0) return `${days} days`;
    return `${days} days, ${remainingHours} hours`;
  };

  const getGracePeriodColor = (seconds: number) => {
    const hours = seconds / 3600;
    if (hours <= 24) return 'text-red-600';
    if (hours <= 72) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getGracePeriodIcon = (seconds: number) => {
    const hours = seconds / 3600;
    if (hours <= 24) return 'text-red-500';
    if (hours <= 72) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Clock className="w-5 h-5 text-gray-600" />
        <span className="text-lg font-medium">Grace Period</span>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isCustom}
            onChange={(e) => setIsCustom(e.target.checked)}
            className="rounded"
          />
          Custom
        </label>
      </div>

      <p className="text-sm text-gray-600">
        The grace period gives you extra time beyond your check-in frequency to respond before funds are distributed.
      </p>

      {!isCustom ? (
        <div className="grid grid-cols-2 gap-3">
          {presetOptions.map((option) => (
            <button
              key={option.seconds}
              onClick={() => onChange(option.seconds)}
              className={`p-4 text-left border rounded-lg transition-all hover:shadow-md ${
                value === option.seconds
                  ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600">{option.description}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
              <input
                type="number"
                min="1"
                max="365"
                value={customValue}
                onChange={(e) => setCustomValue(Number(e.target.value))}
                className="w-full border rounded-lg p-2"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <select
                value={customUnit}
                onChange={(e) => setCustomUnit(e.target.value as any)}
                className="w-full border rounded-lg p-2"
              >
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
            <button
              onClick={handleCustomChange}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Current selection display */}
      <div className={`p-3 rounded-lg border ${getGracePeriodColor(value).replace('text-', 'border-')} bg-${getGracePeriodColor(value).replace('text-', 'bg-')} bg-opacity-10`}>
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${getGracePeriodIcon(value)}`} />
          <span className="font-medium">Current Grace Period:</span>
          <span className={getGracePeriodColor(value)}>{formatGracePeriod(value)}</span>
        </div>
        
        {/* Warning for very short grace periods */}
        {value <= 24 * 3600 && (
          <div className="flex items-center gap-2 mt-2 text-amber-700">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm">Short grace period - ensure you can respond quickly!</span>
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• <strong>Short grace periods (≤24h):</strong> For active users who check in regularly</p>
        <p>• <strong>Medium grace periods (1-3 days):</strong> Balanced approach for most users</p>
        <p>• <strong>Long grace periods (≥1 week):</strong> For users who travel or may be unavailable</p>
      </div>
    </div>
  );
}






