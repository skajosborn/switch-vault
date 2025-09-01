'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ArrowLeft, Mail, Wallet, FileText, Settings, Shield, Clock, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SetupPage() {
  const router = useRouter();
  const { user, token, loading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !token) {
      router.push('/auth/login');
    }
  }, [token, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!token) {
    return null;
  }

  const switchTypes = [
    {
      id: 'letter',
      title: 'Digital Letter',
      description: 'Send a message to loved ones if you don\'t check in',
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      features: ['Personal message', 'Scheduled delivery', 'Multiple recipients'],
      route: '/create-switch?type=letter'
    },
    {
      id: 'wallet',
      title: 'Crypto Wallet',
      description: 'Secure your cryptocurrency and digital assets',
      icon: Wallet,
      color: 'from-green-500 to-emerald-500',
      features: ['Wallet recovery', 'Asset distribution', 'Private key backup'],
      route: '/wallet-setup'
    },
    {
      id: 'instructions',
      title: 'Digital Instructions',
      description: 'Leave detailed instructions for your digital legacy',
      icon: FileText,
      color: 'from-purple-500 to-pink-500',
      features: ['Step-by-step guides', 'Account access', 'Documentation'],
      route: '/create-switch?type=instructions'
    },
    {
      id: 'vault',
      title: 'Digital Vault',
      description: 'Secure storage for important documents and passwords',
      icon: Shield,
      color: 'from-orange-500 to-red-500',
      features: ['Document storage', 'Password management', 'Secure sharing'],
      route: '/create-switch?type=vault'
    },
    {
      id: 'schedule',
      title: 'Scheduled Actions',
      description: 'Automate actions based on check-in status',
      icon: Clock,
      color: 'from-indigo-500 to-purple-500',
      features: ['Automated tasks', 'System actions', 'API integrations'],
      route: '/create-switch?type=schedule'
    },
    {
      id: 'contacts',
      title: 'Emergency Contacts',
      description: 'Manage who gets notified in emergency situations',
      icon: Users,
      color: 'from-teal-500 to-cyan-500',
      features: ['Contact management', 'Notification preferences', 'Escalation rules'],
      route: '/create-switch?type=contacts'
    }
  ];

  const handleCardClick = (route: string) => {
    router.push(route);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-600/30">
                <Settings className="w-6 h-6 text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-white">Choose Your Switch Type</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Page Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">What type of switch would you like to create?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Choose the type of dead man's switch that best fits your needs. You can create multiple switches of different types.
            </p>
          </div>

          {/* Switch Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {switchTypes.map((switchType) => {
              const IconComponent = switchType.icon;
              return (
                <div
                  key={switchType.id}
                  onClick={() => handleCardClick(switchType.route)}
                  className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 cursor-pointer hover:bg-slate-700/50 transition-all duration-300 hover:scale-105 group"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${switchType.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{switchType.title}</h3>
                  </div>
                  
                  <p className="text-slate-400 mb-4">{switchType.description}</p>
                  
                  <div className="space-y-2">
                    {switchType.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                        <span className="text-sm text-slate-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-700">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                      Choose {switchType.title}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
