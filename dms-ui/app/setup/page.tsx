'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Wallet, FileText, Settings, Shield, Clock, Users } from 'lucide-react';

export default function SetupPage() {
  const router = useRouter();

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
      route: '/create-switch?type=wallet'
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
            <h2 className="text-3xl font-bold text-white mb-4">
              What type of switch do you want to set up?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Select the type of dead man's switch that best fits your needs. 
              Each type offers different features and customization options.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {switchTypes.map((type) => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  onClick={() => handleCardClick(type.route)}
                  className="group cursor-pointer"
                >
                  <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/70 hover:border-slate-600/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                    {/* Icon */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                      {type.title}
                    </h3>
                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {type.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-400">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Action */}
                    <div className="mt-6 pt-4 border-t border-slate-700/30">
                      <div className={`inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r ${type.color} bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300`}>
                        Set up {type.title}
                        <ArrowLeft className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-slate-400 mb-4">
              Not sure which type to choose?
            </p>
            <button
              onClick={() => router.push('/create-switch')}
              className="bg-slate-700 hover:bg-slate-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-600/30"
            >
              Start with Basic Setup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
