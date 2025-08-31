'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Clock } from 'lucide-react';

interface FrequencyOption {
  value: string;
  label: string;
  hours: number;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: '24h', label: '24 hours', hours: 24 },
  { value: '3d', label: '3 days', hours: 72 },
  { value: '1w', label: '1 week', hours: 168 },
  { value: '1m', label: '1 month', hours: 720 },
  { value: '3m', label: '3 months', hours: 2160 },
  { value: '6m', label: '6 months', hours: 4320 },
  { value: '1y', label: '1 year', hours: 8760 }
];

interface FrequencySelectorProps {
  value: number; // in hours
  onChange: (hours: number) => void;
  className?: string;
}

export default function FrequencySelector({ value, onChange, className = '' }: FrequencySelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FrequencyOption>(
    FREQUENCY_OPTIONS.find(opt => opt.hours === value) || FREQUENCY_OPTIONS[2]
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the closest option to the current value
  const getClosestOption = (hours: number): FrequencyOption => {
    return FREQUENCY_OPTIONS.reduce((prev, curr) => 
      Math.abs(curr.hours - hours) < Math.abs(prev.hours - hours) ? curr : prev
    );
  };

  // Update selected option when value changes
  useEffect(() => {
    const closest = getClosestOption(value);
    setSelectedOption(closest);
  }, [value]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
  };

  // Handle option selection from dropdown
  const handleOptionSelect = (option: FrequencyOption) => {
    setSelectedOption(option);
    onChange(option.hours);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get slider percentage for visual representation
  const getSliderPercentage = () => {
    const min = FREQUENCY_OPTIONS[0].hours;
    const max = FREQUENCY_OPTIONS[FREQUENCY_OPTIONS.length - 1].hours;
    return ((value - min) / (max - min)) * 100;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Check-in Frequency</h3>
      </div>
      
      {/* Question */}
      <p className="text-slate-300">How often would you like to check in?</p>

      {/* Slider */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="range"
            min={FREQUENCY_OPTIONS[0].hours}
            max={FREQUENCY_OPTIONS[FREQUENCY_OPTIONS.length - 1].hours}
            value={value}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${getSliderPercentage()}%, #475569 ${getSliderPercentage()}%, #475569 100%)`
            }}
          />
        </div>
        
        {/* Value Display */}
        <div className="text-center">
          <span className="text-lg font-bold text-white">
            {selectedOption.label}
          </span>
        </div>
      </div>

      {/* Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between p-3 border border-slate-600 rounded-lg bg-slate-700 text-left hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <span className="text-white">{selectedOption.label}</span>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Options */}
        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-slate-700 border border-slate-600 rounded-lg shadow-lg max-h-60 overflow-auto">
            {FREQUENCY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-3 py-2 hover:bg-slate-600 transition-colors ${
                  option.hours === selectedOption.hours ? 'bg-slate-600 text-white' : 'text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Custom CSS for slider styling */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          border: none;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
}
