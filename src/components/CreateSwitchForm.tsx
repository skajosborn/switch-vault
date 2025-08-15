'use client';

import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CreateSwitchFormData } from '@/types';

interface CreateSwitchFormProps {
  onSubmit: (data: CreateSwitchFormData) => void;
  onCancel: () => void;
}

export default function CreateSwitchForm({ onSubmit, onCancel }: CreateSwitchFormProps) {
  const [formData, setFormData] = useState<CreateSwitchFormData>({
    message: '',
    checkInInterval: 24,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.message.trim()) {
      onSubmit(formData);
    }
  };

  // Form card styles with !important to override conflicts
  const formCardStyle = {
    backgroundColor: '#1e40af !important',
    border: '2px solid #2563eb !important',
    borderRadius: '0.75rem !important',
    boxShadow: '0 20px 30px rgba(0, 0, 0, 0.3) !important',
    transition: 'all 0.3s ease !important',
    padding: '2.5rem !important',
    margin: '2rem 0 !important'
  };

  const glassInputStyle = {
    backgroundColor: '#334155',
    border: '2px solid #2563eb',
    borderRadius: '0.75rem',
    color: 'white',
    transition: 'all 0.3s ease'
  };

  const gradientButtonStyle = {
    background: 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(6, 182, 212) 100%)',
    color: 'white',
    fontWeight: '600',
    transition: 'all 0.3s',
    transform: 'scale(1)',
    boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
    border: 'none'
  };

  return (
    <div style={formCardStyle} className="max-w-3xl mx-auto">
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-600/30">
            <MessageSquare className="w-8 h-8 text-blue-400" />
          </div>
          <h2 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            fontWeight: '600',
            lineHeight: '1.3'
          }}>
            Create New Switch
          </h2>
        </div>
        <p style={{ 
          color: '#bfdbfe', 
          fontSize: '1.125rem',
          lineHeight: '1.5'
        }}>
          Set up your safety net by configuring your message and check-in schedule
        </p>
      </div>
      
      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Message Section */}
        <div>
          <label style={{ 
            display: 'block', 
            color: '#bfdbfe', 
            fontSize: '1rem', 
            fontWeight: '500',
            marginBottom: '0.75rem' 
          }}>
            Message to send if you don't check in:
          </label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Enter your message here..."
            style={glassInputStyle}
            className="w-full p-4"
            rows={4}
            required
          />
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '0.875rem', 
            marginTop: '0.5rem',
            lineHeight: '1.4'
          }}>
            This message will be automatically sent if you miss your check-in deadline.
          </p>
        </div>
        
        {/* Interval Section */}
        <div>
          <label style={{ 
            display: 'block', 
            color: '#bfdbfe', 
            fontSize: '1rem', 
            fontWeight: '500',
            marginBottom: '0.75rem' 
          }}>
            Check-in interval (hours):
          </label>
          <input
            type="number"
            value={formData.checkInInterval}
            onChange={(e) => setFormData(prev => ({ ...prev, checkInInterval: Number(e.target.value) }))}
            min="1"
            max="168"
            style={glassInputStyle}
            className="w-full p-4"
            required
          />
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '0.875rem', 
            marginTop: '0.5rem',
            lineHeight: '1.4'
          }}>
            How often you need to check in to keep your switch active (1-168 hours).
          </p>
        </div>
        
        {/* Actions Section */}
        <div className="flex gap-4 pt-6 border-t border-slate-600/30">
          <button
            type="submit"
            disabled={!formData.message.trim()}
            style={gradientButtonStyle}
            className="px-8 py-3 rounded-xl font-semibold flex-1"
          >
            Create Switch
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-500/30 flex-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
