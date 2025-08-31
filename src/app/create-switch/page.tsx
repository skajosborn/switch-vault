'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreateSwitchFormData } from '@/types';
import CreateSwitchForm from '@/components/CreateSwitchForm';
import { useDeadMansSwitches } from '@/hooks/useDeadMansSwitches';
import { ArrowLeft, Shield, Mail, Wallet, FileText, Clock, Users } from 'lucide-react';

export default function CreateSwitchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createSwitch } = useDeadMansSwitches();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [switchType, setSwitchType] = useState<string>('basic');

  const handleCreateSwitch = async (data: CreateSwitchFormData) => {
    setIsSubmitting(true);
    try {
      await createSwitch(data);
      router.push('/'); // Redirect to home after successful creation
    } catch (error) {
      console.error('Error creating switch:', error);
      // You could add error handling here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/setup');
  };

  // Get switch type from URL parameters
  useEffect(() => {
    const type = searchParams.get('type');
    console.log('URL type parameter:', type);
    if (type) {
      setSwitchType(type);
    }
  }, [searchParams]);

  // Also check on mount for client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get('type');
      console.log('Client-side URL type parameter:', type);
      if (type) {
        setSwitchType(type);
      }
    }
  }, []);

  const getSwitchTypeInfo = () => {
    console.log('Current switchType:', switchType);
    switch (switchType) {
      case 'letter':
        return {
          title: 'Digital Letter',
          description: 'Send a message to loved ones if you don\'t check in',
          icon: Mail,
          color: 'from-blue-500 to-cyan-500'
        };
      case 'wallet':
        return {
          title: 'Crypto Wallet',
          description: 'Secure your cryptocurrency and digital assets',
          icon: Wallet,
          color: 'from-green-500 to-emerald-500'
        };
      case 'instructions':
        return {
          title: 'Digital Instructions',
          description: 'Leave detailed instructions for your digital legacy',
          icon: FileText,
          color: 'from-purple-500 to-pink-500'
        };
      case 'vault':
        return {
          title: 'Digital Vault',
          description: 'Secure storage for important documents and passwords',
          icon: Shield,
          color: 'from-orange-500 to-red-500'
        };
      case 'schedule':
        return {
          title: 'Scheduled Actions',
          description: 'Automate actions based on check-in status',
          icon: Clock,
          color: 'from-indigo-500 to-purple-500'
        };
      case 'contacts':
        return {
          title: 'Emergency Contacts',
          description: 'Manage who gets notified in emergency situations',
          icon: Users,
          color: 'from-teal-500 to-cyan-500'
        };
      default:
        return {
          title: 'Basic Switch',
          description: 'Configure your dead man\'s switch with customizable check-in schedules',
          icon: Shield,
          color: 'from-blue-500 to-cyan-500'
        };
    }
  };

  const switchTypeInfo = getSwitchTypeInfo();
  const IconComponent = switchTypeInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className={`p-2 bg-gradient-to-r ${switchTypeInfo.color} bg-opacity-20 rounded-lg border border-opacity-30`}>
                <IconComponent className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Create {switchTypeInfo.title}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              {switchTypeInfo.title}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {switchTypeInfo.description}
            </p>
          </div>

          {/* Form */}
          <CreateSwitchForm
            onSubmit={handleCreateSwitch}
            onCancel={handleCancel}
            isSubmitting={isSubmitting}
            switchType={switchType}
          />
        </div>
      </div>
    </div>
  );
}

