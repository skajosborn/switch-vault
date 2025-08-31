'use client';

import { Shield, Bell, Zap, Clock, Users, Settings, AlertTriangle } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-400" />,
      title: 'Customizable Plans',
      description: 'Choose from Basic, Standard, or Premium plans, or create your own custom configuration with flexible check-in intervals and grace periods.',
      highlights: ['3 pre-built templates', 'Custom intervals (1-168 hours)', 'Adjustable grace periods', 'Plan naming and organization']
    },
    {
      icon: <Bell className="w-8 h-8 text-yellow-400" />,
      title: 'Smart Reminders',
      description: 'Configure reminder frequency and advance warnings to ensure you never miss a check-in deadline.',
      highlights: ['Hourly, daily, or weekly reminders', 'Customizable advance warnings', 'Personalized reminder messages', 'Flexible scheduling options']
    },
    {
      icon: <Zap className="w-8 h-8 text-green-400" />,
      title: 'Multi-Channel Notifications',
      description: 'Stay informed across multiple platforms with support for email, SMS, push notifications, Slack, Discord, and custom webhooks.',
      highlights: ['Email notifications', 'SMS alerts', 'Push notifications', 'Slack integration', 'Discord webhooks', 'Custom webhook support']
    },
    {
      icon: <Clock className="w-8 h-8 text-purple-400" />,
      title: 'Flexible Timing',
      description: 'Set your own check-in schedule with intervals ranging from hourly to weekly, plus configurable grace periods.',
      highlights: ['1-168 hour intervals', '0-72 hour grace periods', 'Auto-renewal options', 'Deadline calculations']
    },
    {
      icon: <Users className="w-8 h-8 text-red-400" />,
      title: 'Emergency Contacts',
      description: 'Add trusted contacts who will be notified in case of emergency, ensuring your safety net extends beyond just you.',
      highlights: ['Multiple contact support', 'Email-based notifications', 'Contact management', 'Emergency protocols']
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-orange-400" />,
      title: 'Custom Actions',
      description: 'Define custom actions that trigger when your switch activates, from simple notifications to complex automated responses.',
      highlights: ['Email actions', 'SMS triggers', 'Webhook calls', 'File transfers', 'Crypto operations', 'Priority levels']
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 style={{ 
          color: 'white', 
          fontSize: '3rem', 
          fontWeight: 'bold', 
          marginBottom: '1.5rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Powerful Customization Options
        </h2>
        <p style={{ 
          color: '#bfdbfe', 
          fontSize: '1.25rem', 
          maxWidth: '64rem',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Tailor your safety switch to your exact needs with our comprehensive customization system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 rounded-xl border border-slate-600/30 bg-slate-800/20 backdrop-blur-sm hover:border-slate-500/50 transition-all duration-300 hover:transform hover:scale-105"
          >
            <div className="flex items-center gap-3 mb-4">
              {feature.icon}
              <h3 style={{ 
                color: 'white', 
                fontSize: '1.25rem', 
                fontWeight: '600',
                lineHeight: '1.3'
              }}>
                {feature.title}
              </h3>
            </div>
            
            <p style={{ 
              color: '#94a3b8', 
              fontSize: '0.875rem',
              lineHeight: '1.5',
              marginBottom: '1rem'
            }}>
              {feature.description}
            </p>
            
            <ul className="space-y-2">
              {feature.highlights.map((highlight, highlightIndex) => (
                <li key={highlightIndex} className="flex items-center gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Plan Templates Preview */}
      <div className="mt-20 text-center">
        <h3 style={{ 
          color: 'white', 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
        }}>
          Choose Your Protection Level
        </h3>
        <p style={{ 
          color: '#bfdbfe', 
          fontSize: '1.125rem',
          marginBottom: '3rem',
          lineHeight: '1.6'
        }}>
          Start with a template and customize to your needs, or build from scratch
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-xl border-2 border-slate-600 bg-slate-800/30">
            <h4 className="text-xl font-semibold text-white mb-3">Basic Safety</h4>
            <p className="text-slate-300 text-sm mb-4">Perfect for simple safety needs</p>
            <ul className="text-left space-y-2 text-sm text-slate-400">
              <li>• Daily check-ins</li>
              <li>• Email notifications</li>
              <li>• 12-hour grace period</li>
              <li>• Basic monitoring</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-xl border-2 border-blue-500 bg-blue-500/10">
            <h4 className="text-xl font-semibold text-white mb-3">Standard Protection</h4>
            <p className="text-slate-300 text-sm mb-4">Enhanced monitoring & alerts</p>
            <ul className="text-left space-y-2 text-sm text-slate-400">
              <li>• 12-hour check-ins</li>
              <li>• Multi-channel notifications</li>
              <li>• Auto-renewal</li>
              <li>• 6-hour grace period</li>
            </ul>
          </div>
          
          <div className="p-6 rounded-xl border-2 border-slate-600 bg-slate-800/30">
            <h4 className="text-xl font-semibold text-white mb-3">Premium Security</h4>
            <p className="text-slate-300 text-sm mb-4">Maximum protection & features</p>
            <ul className="text-left space-y-2 text-sm text-slate-400">
              <li>• 6-hour check-ins</li>
              <li>• All notification channels</li>
              <li>• Custom actions</li>
              <li>• 2-hour grace period</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
