'use client';

import { useState } from 'react';
import { MessageSquare, Settings, Shield } from 'lucide-react';
import { CreateSwitchFormData } from '@/types';
import SwitchPlanCustomizer from './SwitchPlanCustomizer';
import LetterEditor from './LetterEditor';

interface CreateSwitchFormProps {
  onSubmit: (data: CreateSwitchFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  switchType?: string;
}

export default function CreateSwitchForm({ onSubmit, onCancel, isSubmitting = false, switchType = 'basic' }: CreateSwitchFormProps) {
  const [formData, setFormData] = useState<CreateSwitchFormData>({
    message: '',
    checkInInterval: 12,
    planName: 'My Safety Switch',
    gracePeriod: 6,
    reminders: {
      enabled: true,
      frequency: 'daily',
      advanceWarning: 24,
      customMessage: ''
    },
    notifications: {
      email: true,
      sms: false,
      push: true,
      slack: false,
      discord: false
    },
    autoRenewal: true,
    emergencyContacts: [],
    customActions: []
  });

  const [currentStep, setCurrentStep] = useState<'message' | 'customization' | 'review'>('message');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.message.trim()) {
      onSubmit(formData);
    }
  };

  const handlePlanChange = (planUpdates: Partial<CreateSwitchFormData>) => {
    setFormData(prev => ({ ...prev, ...planUpdates }));
  };

  const nextStep = () => {
    if (currentStep === 'message') setCurrentStep('customization');
    else if (currentStep === 'customization') setCurrentStep('review');
  };

  const prevStep = () => {
    if (currentStep === 'customization') setCurrentStep('message');
    else if (currentStep === 'review') setCurrentStep('customization');
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

  const stepIndicatorStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '2rem',
    gap: '1rem'
  };

  const getMessagePlaceholder = () => {
    switch (switchType) {
      case 'letter':
        return 'Write your final message to loved ones...';
      case 'wallet':
        return 'Enter your wallet recovery instructions...';
      case 'instructions':
        return 'Write detailed instructions for your digital legacy...';
      case 'vault':
        return 'Enter vault access instructions and important notes...';
      case 'schedule':
        return 'Describe the actions to be taken if you don\'t check in...';
      case 'contacts':
        return 'Write instructions for emergency contacts...';
      default:
        return 'Write your message...';
    }
  };

  const getMessageDescription = () => {
    switch (switchType) {
      case 'letter':
        return 'This letter will be automatically sent to your loved ones if you miss your check-in deadline.';
      case 'wallet':
        return 'These instructions will help recover your cryptocurrency wallets and digital assets.';
      case 'instructions':
        return 'These detailed instructions will guide others on how to handle your digital legacy.';
      case 'vault':
        return 'These instructions will provide access to your secure vault and important documents.';
      case 'schedule':
        return 'These actions will be automatically executed if you don\'t check in on time.';
      case 'contacts':
        return 'These instructions will be sent to your emergency contacts in case of emergency.';
      default:
        return 'This message will be automatically sent if you miss your check-in deadline.';
    }
  };

  const stepStyle = (isActive: boolean, isCompleted: boolean) => ({
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontSize: '0.875rem',
    transition: 'all 0.3s ease',
    ...(isActive ? {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
    } : isCompleted ? {
      backgroundColor: '#10b981',
      color: 'white'
    } : {
      backgroundColor: '#475569',
      color: '#94a3b8'
    })
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 'message':
        return (
          <div className="space-y-8">
            {/* Message Section */}
            <div>
              <LetterEditor
                value={formData.message}
                onChange={(content) => setFormData(prev => ({ ...prev, message: content }))}
                className="w-full"
                placeholder={getMessagePlaceholder()}
              />
              <p style={{ 
                color: '#94a3b8', 
                fontSize: '0.875rem', 
                marginTop: '0.5rem',
                lineHeight: '1.4'
              }}>
                {getMessageDescription()}
              </p>
            </div>

            {/* Plan Name */}
            <div>
              <label style={{ 
                display: 'block', 
                color: '#bfdbfe', 
                fontSize: '1rem', 
                fontWeight: '500',
                marginBottom: '0.75rem' 
              }}>
                Switch Name:
              </label>
              <input
                type="text"
                value={formData.planName}
                onChange={(e) => setFormData(prev => ({ ...prev, planName: e.target.value }))}
                placeholder="My Safety Switch"
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
                Give your switch a memorable name for easy identification.
              </p>
            </div>
          </div>
        );

      case 'customization':
        return (
          <SwitchPlanCustomizer
            onPlanChange={handlePlanChange}
            initialPlan={formData}
          />
        );

      case 'review':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white mb-6">Review Your Switch Configuration</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Basic Information</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  <p><strong>Name:</strong> {formData.planName}</p>
                  <p><strong>Check-in Interval:</strong> {formData.checkInInterval} hours</p>
                  <p><strong>Grace Period:</strong> {Math.round(formData.gracePeriod / 24)} days</p>
                  <p><strong>Auto-renewal:</strong> {formData.autoRenewal ? 'Yes' : 'No'}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Notifications</h4>
                <div className="space-y-2 text-sm text-slate-300">
                  {Object.entries(formData.notifications).map(([key, value]) => {
                    if (key === 'customWebhook') return null;
                    return (
                      <p key={key}>
                        <strong className="capitalize">{key}:</strong> {value ? 'Yes' : 'No'}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg">
              <h4 className="font-semibold text-white mb-3">Letter Preview</h4>
              <div className="bg-white p-6 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                <div className="text-gray-900 whitespace-pre-wrap font-serif">
                  {formData.message || 'No letter content yet...'}
                </div>
              </div>
            </div>

            {formData.emergencyContacts && formData.emergencyContacts.length > 0 && (
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Emergency Contacts</h4>
                <div className="space-y-2">
                  {formData.emergencyContacts.map((contact, index) => (
                    <div key={index} className="text-sm text-slate-300 bg-slate-700 p-2 rounded">
                      {contact}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {formData.customActions && formData.customActions.length > 0 && (
              <div className="bg-slate-800/50 p-4 rounded-lg">
                <h4 className="font-semibold text-white mb-3">Custom Actions</h4>
                <div className="space-y-2">
                  {formData.customActions.map((action, index) => (
                    <div key={index} className="text-sm text-slate-300 bg-slate-700 p-2 rounded flex justify-between items-center">
                      <span>{action.name} ({action.type})</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        action.priority === 'critical' ? 'bg-red-600 text-white' :
                        action.priority === 'high' ? 'bg-orange-600 text-white' :
                        action.priority === 'medium' ? 'bg-yellow-600 text-black' :
                        'bg-green-600 text-white'
                      }`}>
                        {action.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={formCardStyle} className="max-w-4xl mx-auto">
      {/* Form Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/20 rounded-lg border border-blue-600/30">
            <Shield className="w-8 h-8 text-blue-400" />
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
          Set up your safety net with customizable options and advanced features
        </p>
      </div>

      {/* Step Indicator */}
      <div style={stepIndicatorStyle}>
        <div style={stepStyle(currentStep === 'message', false)}>1</div>
        <div style={stepStyle(currentStep === 'customization', currentStep === 'review')}>2</div>
        <div style={stepStyle(currentStep === 'review', false)}>3</div>
      </div>

      {/* Step Labels */}
      <div className="flex justify-center gap-8 mb-8 text-sm text-slate-400">
        <span className={currentStep === 'message' ? 'text-blue-400 font-medium' : ''}>Basic Info</span>
        <span className={currentStep === 'customization' ? 'text-blue-400 font-medium' : ''}>Customization</span>
        <span className={currentStep === 'review' ? 'text-blue-400 font-medium' : ''}>Review</span>
      </div>
      
      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {renderStepContent()}
        
        {/* Actions Section */}
        <div className="flex gap-4 pt-6 border-t border-slate-600/30">
          {currentStep !== 'message' && (
            <button
              type="button"
              onClick={prevStep}
              className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-500/30"
            >
              Previous
            </button>
          )}
          
          {currentStep !== 'review' ? (
            <button
              type="button"
              onClick={nextStep}
              disabled={currentStep === 'message' && !formData.message.trim()}
              style={gradientButtonStyle}
              className="px-8 py-3 rounded-xl font-semibold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              disabled={!formData.message.trim() || isSubmitting}
              style={gradientButtonStyle}
              className="px-8 py-3 rounded-xl font-semibold flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Switch'}
            </button>
          )}
          
          <button
            type="button"
            onClick={onCancel}
            className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-500/30"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
