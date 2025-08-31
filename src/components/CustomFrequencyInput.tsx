"use client";
import { useState } from "react";

interface CustomFrequencyInputProps {
  value: number;
  onChange: (seconds: number) => void;
}

export default function CustomFrequencyInput({ value, onChange }: CustomFrequencyInputProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState(7);
  const [customUnit, setCustomUnit] = useState<'days' | 'weeks' | 'months'>('days');

  const presetOptions = [
    { label: "Daily", seconds: 24 * 3600 },
    { label: "Weekly", seconds: 7 * 24 * 3600 },
    { label: "Bi-weekly", seconds: 14 * 24 * 3600 },
    { label: "Monthly (30d)", seconds: 30 * 24 * 3600 },
    { label: "Bi-monthly", seconds: 60 * 24 * 3600 },
    { label: "Quarterly", seconds: 90 * 24 * 3600 },
    { label: "Bi-annual", seconds: 182 * 24 * 3600 },
    { label: "Annual", seconds: 365 * 24 * 3600 },
  ];

  const handleCustomChange = () => {
    let seconds = customValue;
    switch (customUnit) {
      case 'weeks':
        seconds *= 7;
        break;
      case 'months':
        seconds *= 30;
        break;
    }
    onChange(seconds * 24 * 3600);
  };

  const formatFrequency = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 3600));
    if (days === 1) return "1 day";
    if (days < 7) return `${days} days`;
    if (days < 30) return `${Math.floor(days / 7)} weeks`;
    if (days < 365) return `${Math.floor(days / 30)} months`;
    return `${Math.floor(days / 365)} years`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Check-in Frequency</span>
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

      {!isCustom ? (
        <div className="grid grid-cols-2 gap-2">
          {presetOptions.map((option) => (
            <button
              key={option.seconds}
              onClick={() => onChange(option.seconds)}
              className={`p-3 text-left border rounded-lg transition-colors ${
                value === option.seconds
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-600">{formatFrequency(option.seconds)}</div>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Value</label>
            <input
              type="number"
              min="1"
              value={customValue}
              onChange={(e) => setCustomValue(Number(e.target.value))}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Unit</label>
            <select
              value={customUnit}
              onChange={(e) => setCustomUnit(e.target.value as any)}
              className="w-full border rounded-lg p-2"
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>
          <button
            onClick={handleCustomChange}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      )}

      <div className="text-sm text-gray-600">
        Current: <span className="font-medium">{formatFrequency(value)}</span>
      </div>
    </div>
  );
}

