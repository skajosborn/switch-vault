'use client';

import { useState } from 'react';
import { 
  Bell, 
  Clock, 
  MessageSquare, 
  Shield, 
  Zap, 
  Users, 
  Settings,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { 
  ReminderSettings, 
  NotificationSettings, 
  CustomAction,
  SwitchPlanTemplate 
} from '@/types';
import FrequencySelector from './FrequencySelector';

interface SwitchPlanCustomizerProps {
  onPlanChange: (plan: Partial<SwitchPlanTemplate>) => void;
  initialPlan?: Partial<SwitchPlanTemplate>;
}

const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: true,
  frequency: 'daily',
  advanceWarning: 24,
  customMessage: ''
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  email: true,
  sms: false,
  push: true,
  slack: false,
  discord: false
};

const PLAN_TEMPLATES: SwitchPlanTemplate[] = [
  {
    id: 'basic',
    name: 'Basic Safety',
    description: 'Simple check-ins with email notifications',
    checkInInterval: 24,
    gracePeriod: 2 * 24, // 2 days
    reminders: { ...DEFAULT_REMINDERS, frequency: 'daily' },
    notifications: { ...DEFAULT_NOTIFICATIONS, email: true, sms: false, push: false },
    autoRenewal: false,
    features: ['Daily check-ins', 'Email notifications', '2-day grace period'],
    emergencyContacts: [],
    customActions: []
  },
  {
    id: 'standard',
    name: 'Standard Protection',
    description: 'Enhanced monitoring with multiple notification channels',
    checkInInterval: 12,
    gracePeriod: 1 * 24, // 1 day
    reminders: { ...DEFAULT_REMINDERS, frequency: 'daily', advanceWarning: 12 },
    notifications: { ...DEFAULT_NOTIFICATIONS, email: true, sms: true, push: true },
    autoRenewal: true,
    features: ['12-hour check-ins', 'Multi-channel notifications', 'Auto-renewal', '1-day grace period'],
    emergencyContacts: [],
    customActions: []
  },
  {
    id: 'premium',
    name: 'Premium Security',
    description: 'Maximum protection with advanced features and custom actions',
    checkInInterval: 6,
    gracePeriod: 0.5 * 24, // 12 hours (0.5 days)
    reminders: { ...DEFAULT_REMINDERS, frequency: 'hourly', advanceWarning: 6 },
    notifications: { ...DEFAULT_NOTIFICATIONS, email: true, sms: true, push: true, slack: true, discord: true },
    autoRenewal: true,
    features: ['6-hour check-ins', 'All notification channels', 'Custom actions', '12-hour grace period', 'Priority support'],
    emergencyContacts: [],
    customActions: []
  }
];

export default function SwitchPlanCustomizer({ onPlanChange, initialPlan }: SwitchPlanCustomizerProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('standard');
  const [customPlan, setCustomPlan] = useState<Partial<SwitchPlanTemplate>>({
    checkInInterval: 12,
    gracePeriod: 1 * 24, // 1 day
    reminders: { ...DEFAULT_REMINDERS },
    notifications: { ...DEFAULT_NOTIFICATIONS },
    autoRenewal: true,
    emergencyContacts: [],
    customActions: []
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [newContact, setNewContact] = useState('');
  const [newAction, setNewAction] = useState<Partial<CustomAction>>({
    type: 'email',
    name: '',
    priority: 'medium'
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = PLAN_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setCustomPlan({
        ...template,
        emergencyContacts: customPlan.emergencyContacts || [],
        customActions: customPlan.customActions || []
      });
      onPlanChange(template);
    }
  };

  const updateCustomPlan = (updates: Partial<SwitchPlanTemplate>) => {
    const updated = { ...customPlan, ...updates };
    setCustomPlan(updated);
    onPlanChange(updated);
  };

  const addEmergencyContact = () => {
    if (newContact.trim() && !customPlan.emergencyContacts?.includes(newContact.trim())) {
      const updated = {
        ...customPlan,
        emergencyContacts: [...(customPlan.emergencyContacts || []), newContact.trim()]
      };
      setCustomPlan(updated);
      onPlanChange(updated);
      setNewContact('');
    }
  };

  const removeEmergencyContact = (contact: string) => {
    const updated = {
      ...customPlan,
      emergencyContacts: (customPlan.emergencyContacts || []).filter((c: string) => c !== contact)
    };
    setCustomPlan(updated);
    onPlanChange(updated);
  };

  const addCustomAction = () => {
    if (newAction.name && newAction.type) {
      const action: CustomAction = {
        ...newAction as CustomAction,
        config: {},
        id: Date.now().toString()
      };
      const updated = {
        ...customPlan,
        customActions: [...(customPlan.customActions || []), action]
      };
      setCustomPlan(updated);
      onPlanChange(updated);
      setNewAction({ type: 'email', name: '', priority: 'medium' });
    }
  };

  const removeCustomAction = (actionId: string) => {
    const updated = {
      ...customPlan,
      customActions: (customPlan.customActions || []).filter((a: CustomAction) => a.id !== actionId)
    };
    setCustomPlan(updated);
    onPlanChange(updated);
  };

  return (
    <div className="space-y-8">
      {/* Plan Templates */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          Choose Your Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLAN_TEMPLATES.map((template) => (
            <div
              key={template.id}
              onClick={() => handleTemplateSelect(template.id)}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'
              }`}
            >
              <h4 className="font-semibold text-white mb-2">{template.name}</h4>
              <p className="text-sm text-slate-300 mb-3">{template.description}</p>
              <ul className="text-xs text-slate-400 space-y-1">
                {template.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Basic Settings */}
      <div className="space-y-6">
        {/* Check-in Interval with Frequency Selector */}
        <div>
          <FrequencySelector
            value={customPlan.checkInInterval}
            onChange={(value) => updateCustomPlan({ checkInInterval: value })}
            className="bg-slate-800/50 p-6 rounded-lg border border-slate-600"
          />
        </div>
        
        {/* Grace Period */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Grace Period (days)
          </label>
          <input
            type="number"
            value={Math.round(customPlan.gracePeriod / 24)} // Convert hours to days
            onChange={(e) => updateCustomPlan({ gracePeriod: Number(e.target.value) * 24 })} // Convert days to hours
            min="1"
            max="30"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
          />
          <p className="text-xs text-slate-400 mt-1">
            How many days after missing a check-in before the switch is triggered
          </p>
        </div>
      </div>

      {/* Asset Distribution */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-400" />
          Asset Distribution
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Distribution Method
              </label>
              <select
                value={customPlan.distributionMethod || 'immediate'}
                onChange={(e) => updateCustomPlan({ distributionMethod: e.target.value })}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="immediate">Immediate (when triggered)</option>
                <option value="delayed">Delayed (after grace period)</option>
                <option value="staged">Staged (over time)</option>
                <option value="conditional">Conditional (based on rules)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Asset Types
              </label>
              <div className="space-y-2">
                {['crypto', 'nfts', 'files', 'messages'].map((assetType) => (
                  <div key={assetType} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`asset-${assetType}`}
                      checked={customPlan.assetTypes?.includes(assetType) || false}
                      onChange={(e) => {
                        const currentTypes = customPlan.assetTypes || [];
                        const updatedTypes = e.target.checked
                          ? [...currentTypes, assetType]
                          : currentTypes.filter(t => t !== assetType);
                        updateCustomPlan({ assetTypes: updatedTypes });
                      }}
                      className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                    />
                    <label htmlFor={`asset-${assetType}`} className="text-slate-300 capitalize">
                      {assetType === 'nfts' ? 'NFTs' : assetType}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Beneficiary Configuration */}
          <div>
            <h4 className="text-md font-medium text-slate-300 mb-3">Beneficiaries</h4>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPlan.newBeneficiary?.address || ''}
                  onChange={(e) => updateCustomPlan({
                    newBeneficiary: { ...customPlan.newBeneficiary, address: e.target.value }
                  })}
                  placeholder="0x... (Ethereum address)"
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
                <input
                  type="text"
                  value={customPlan.newBeneficiary?.name || ''}
                  onChange={(e) => updateCustomPlan({
                    newBeneficiary: { ...customPlan.newBeneficiary, name: e.target.value }
                  })}
                  placeholder="Beneficiary name"
                  className="w-40 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
                <select
                  value={customPlan.newBeneficiary?.type || 'wallet'}
                  onChange={(e) => updateCustomPlan({
                    newBeneficiary: { ...customPlan.newBeneficiary, type: e.target.value }
                  })}
                  className="w-32 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="wallet">Wallet</option>
                  <option value="exchange">Exchange</option>
                  <option value="contract">Contract</option>
                </select>
                <button
                  onClick={() => {
                    if (customPlan.newBeneficiary?.address && customPlan.newBeneficiary?.name) {
                      const beneficiary = {
                        id: Date.now().toString(),
                        address: customPlan.newBeneficiary.address,
                        name: customPlan.newBeneficiary.name,
                        type: customPlan.newBeneficiary.type || 'wallet',
                        percentage: 0
                      };
                      const updated = {
                        ...customPlan,
                        beneficiaries: [...(customPlan.beneficiaries || []), beneficiary],
                        newBeneficiary: { address: '', name: '', type: 'wallet' }
                      };
                      setCustomPlan(updated);
                      onPlanChange(updated);
                    }
                  }}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              {/* Existing Beneficiaries */}
              <div className="space-y-2">
                {customPlan.beneficiaries?.map((beneficiary, index) => (
                  <div key={beneficiary.id} className="flex items-center gap-3 p-3 bg-slate-700 rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-3">
                      <span className="text-slate-300 text-sm">{beneficiary.name}</span>
                      <span className="text-slate-400 text-xs font-mono">{beneficiary.address.slice(0, 8)}...{beneficiary.address.slice(-6)}</span>
                      <span className="text-slate-400 text-xs capitalize">{beneficiary.type}</span>
                    </div>
                    <button
                      onClick={() => {
                        const updated = {
                          ...customPlan,
                          beneficiaries: customPlan.beneficiaries?.filter((_, i) => i !== index)
                        };
                        setCustomPlan(updated);
                        onPlanChange(updated);
                      }}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Reminders */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5 text-yellow-400" />
          Enhanced Reminder Settings
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="reminders-enabled"
              checked={customPlan.reminders?.enabled || false}
              onChange={(e) => updateCustomPlan({
                reminders: { 
                  ...customPlan.reminders!, 
                  enabled: e.target.checked 
                }
              })}
              className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
            />
            <label htmlFor="reminders-enabled" className="text-slate-300">
              Enable reminders
            </label>
          </div>
          
          {customPlan.reminders?.enabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Reminder Frequency
                  </label>
                  <select
                    value={customPlan.reminders?.frequency || 'daily'}
                    onChange={(e) => updateCustomPlan({
                      reminders: { 
                        ...customPlan.reminders!, 
                        frequency: e.target.value as any 
                      }
                    })}
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Advance Warning (hours)
                  </label>
                  <input
                    type="number"
                    value={customPlan.reminders?.advanceWarning || 24}
                    onChange={(e) => updateCustomPlan({
                      reminders: { 
                        ...customPlan.reminders!, 
                        advanceWarning: Number(e.target.value) 
                      }
                    })}
                    min="1"
                    max="168"
                    className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Reminder Methods */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Reminder Methods
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['email', 'sms', 'push', 'telegram', 'discord', 'slack', 'phone_call', 'postal_mail'].map((method) => (
                    <div key={method} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`reminder-${method}`}
                        checked={customPlan.reminders?.methods?.includes(method) || false}
                        onChange={(e) => {
                          const currentMethods = customPlan.reminders?.methods || [];
                          const updatedMethods = e.target.checked
                            ? [...currentMethods, method]
                            : currentMethods.filter(m => m !== method);
                          updateCustomPlan({
                            reminders: { 
                              ...customPlan.reminders!, 
                              methods: updatedMethods 
                            }
                          });
                        }}
                        className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                      />
                      <label htmlFor={`reminder-${method}`} className="text-slate-300 text-sm capitalize">
                        {method.replace('_', ' ')}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalation Settings */}
              <div>
                <h4 className="text-md font-medium text-slate-300 mb-3">Escalation Settings</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Escalation Delay (hours)
                    </label>
                    <input
                      type="number"
                      value={customPlan.reminders?.escalationDelay || 24}
                      onChange={(e) => updateCustomPlan({
                        reminders: { 
                          ...customPlan.reminders!, 
                          escalationDelay: Number(e.target.value) 
                        }
                      })}
                      min="1"
                      max="168"
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Max Escalation Level
                    </label>
                    <select
                      value={customPlan.reminders?.maxEscalation || '3'}
                      onChange={(e) => updateCustomPlan({
                        reminders: { 
                          ...customPlan.reminders!, 
                          maxEscalation: Number(e.target.value) 
                        }
                      })}
                      className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                    >
                      <option value="1">Level 1 (Basic)</option>
                      <option value="2">Level 2 (Enhanced)</option>
                      <option value="3">Level 3 (Urgent)</option>
                      <option value="4">Level 4 (Critical)</option>
                      <option value="5">Level 5 (Emergency)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Custom Reminder Message */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Custom Reminder Message
                </label>
                <textarea
                  value={customPlan.reminders?.customMessage || ''}
                  onChange={(e) => updateCustomPlan({
                    reminders: { 
                      ...customPlan.reminders!, 
                      customMessage: e.target.value 
                    }
                  })}
                  placeholder="Enter custom message for reminders..."
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                  rows={3}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Notifications */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-400" />
          Notification Channels
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(customPlan.notifications || {}).map(([key, value]) => {
            if (key === 'customWebhook') return null;
            return (
              <div key={key} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`notif-${key}`}
                  checked={value || false}
                  onChange={(e) => updateCustomPlan({
                    notifications: { 
                      ...customPlan.notifications!, 
                      [key]: e.target.checked 
                    }
                  })}
                  className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
                />
                <label htmlFor={`notif-${key}`} className="text-slate-300 capitalize">
                  {key}
                </label>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Custom Webhook URL (optional)
          </label>
          <input
            type="url"
            value={customPlan.notifications?.customWebhook || ''}
            onChange={(e) => updateCustomPlan({
              notifications: { 
                ...customPlan.notifications!, 
                customWebhook: e.target.value 
              }
            })}
            placeholder="https://your-webhook-url.com"
            className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Advanced Settings Toggle */}
      <div className="text-center">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-2 mx-auto text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Settings className="w-4 h-4" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
        </button>
      </div>

      {showAdvanced && (
        <>
          {/* Emergency Contacts */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-400" />
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  placeholder="Enter email address"
                  className="flex-1 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
                <button
                  onClick={addEmergencyContact}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-2">
                {customPlan.emergencyContacts?.map((contact: string, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <span className="text-slate-300">{contact}</span>
                    <button
                      onClick={() => removeEmergencyContact(contact)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Custom Actions */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-400" />
              Custom Actions
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <select
                  value={newAction.type}
                  onChange={(e) => setNewAction({ ...newAction, type: e.target.value as any })}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="webhook">Webhook</option>
                  <option value="file_transfer">File Transfer</option>
                  <option value="crypto_transfer">Crypto Transfer</option>
                </select>
                
                <input
                  type="text"
                  value={newAction.name}
                  onChange={(e) => setNewAction({ ...newAction, name: e.target.value })}
                  placeholder="Action name"
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
                
                <select
                  value={newAction.priority}
                  onChange={(e) => setNewAction({ ...newAction, priority: e.target.value as any })}
                  className="p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <button
                onClick={addCustomAction}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Action
              </button>
              
              <div className="space-y-2">
                {customPlan.customActions?.map((action: CustomAction, index: number) => (
                  <div key={action.id || index} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-300">{action.name}</span>
                      <span className="text-xs px-2 py-1 bg-slate-600 rounded text-slate-300">
                        {action.type}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        action.priority === 'critical' ? 'bg-red-600 text-white' :
                        action.priority === 'high' ? 'bg-orange-600 text-white' :
                        action.priority === 'medium' ? 'bg-yellow-600 text-black' :
                        'bg-green-600 text-white'
                      }`}>
                        {action.priority}
                      </span>
                    </div>
                    <button
                      onClick={() => removeCustomAction(action.id || index.toString())}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Auto-renewal */}
          <div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="auto-renewal"
                checked={customPlan.autoRenewal}
                onChange={(e) => updateCustomPlan({ autoRenewal: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-slate-700 border-slate-600 rounded"
              />
              <label htmlFor="auto-renewal" className="text-slate-300">
                Auto-renewal (automatically extend switch when checking in)
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
