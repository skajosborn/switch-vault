'use client';

import { Clock, Bell, Shield } from 'lucide-react';

const features = [
  {
    icon: Clock,
    title: "Custom Inactivity Period",
    description: "Specify the time frame of no activity before the switch is triggered",
    color: "text-blue-400"
  },
  {
    icon: Bell,
    title: "Automated Reminders",
    description: "Receive periodic notifications to confirm you're still active",
    color: "text-cyan-400"
  },
  {
    icon: Shield,
    title: "Secure Message Delivery",
    description: "Automatically send your message when the switch is triggered",
    color: "text-blue-300"
  }
];

export default function FeaturesSection() {
  // Feature card styles - lighter blue for better contrast with !important
  const featureCardStyle = {
    backgroundColor: '#1e40af !important',
    border: '2px solid #2563eb !important',
    borderRadius: '0.75rem !important',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2) !important',
    transition: 'all 0.3s ease !important',
    padding: '1.5rem !important',
    margin: '0.5rem !important',
    minHeight: '250px !important'
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 style={{ 
          color: 'white', 
          fontSize: '2.25rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}>
          Why Choose Safety Net?
        </h2>
        <p style={{ 
          color: '#dbeafe', 
          fontSize: '1.125rem', 
          maxWidth: '42rem', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Our system provides peace of mind through reliable, secure, and automated safety monitoring.
        </p>
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div key={index} style={featureCardStyle} className="text-center group hover:transform hover:scale-105 transition-all duration-300">
            {/* Icon Container */}
            <div className="p-4 bg-blue-600/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-blue-600/30 transition-colors border border-blue-600/30">
              <feature.icon className={`w-8 h-8 ${feature.color}`} />
            </div>
            
            {/* Feature Content */}
            <h3 style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              marginBottom: '0.75rem',
              lineHeight: '1.3'
            }}>
              {feature.title}
            </h3>
            <p style={{ 
              color: '#dbeafe', 
              lineHeight: '1.5',
              fontSize: '0.9rem'
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
