'use client';

import { useState } from 'react';
import { CreateSwitchFormData } from '@/types';
import CreateSwitchForm from '@/components/CreateSwitchForm';
import SwitchCard from '@/components/SwitchCard';
import EmptyState from '@/components/EmptyState';
import FeaturesSection from '@/components/FeaturesSection';
import { useDeadMansSwitches } from '@/hooks/useDeadMansSwitches';

export default function Home() {
  const [isCreating, setIsCreating] = useState(false);
  const { switches, activeSwitches, createSwitch, checkIn, deleteSwitch } = useDeadMansSwitches();

  const handleCreateSwitch = (data: CreateSwitchFormData) => {
    createSwitch(data.message, data.checkInInterval);
    setIsCreating(false);
  };

  // Polished card styles with !important to override any conflicts
  const heroCardStyle = {
    backgroundColor: '#1e40af !important',
    border: '2px solid #3b82f6 !important',
    borderRadius: '1rem !important',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4) !important',
    transition: 'all 0.3s ease !important',
    padding: '2.5rem !important',
    margin: '2rem 0 !important'
  };

  const gradientButtonStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%) !important',
    color: 'white !important',
    fontWeight: '600 !important',
    transition: 'all 0.3s ease !important',
    transform: 'scale(1) !important',
    boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4) !important',
    border: 'none !important',
    padding: '1rem 2rem !important',
    borderRadius: '0.75rem !important',
    fontSize: '1.125rem !important'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 style={{ 
            color: 'white', 
            fontSize: '4rem', 
            fontWeight: 'bold', 
            marginBottom: '2rem',
            lineHeight: '1.1',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            Your Safety Net for When You're Not There
          </h1>
          <p style={{ 
            color: '#dbeafe', 
            fontSize: '1.5rem', 
            maxWidth: '64rem', 
            margin: '0 auto 3rem auto', 
            lineHeight: '1.6',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            Create messages that will be sent automatically if you don't check in within a specified time period. 
            Trust in our secure system to protect what matters most.
          </p>
          
          {/* CTA Button Container */}
          <div style={heroCardStyle} className="max-w-lg mx-auto">
            <button
              onClick={() => setIsCreating(true)}
              style={gradientButtonStyle}
              className="w-full hover:scale-105 active:scale-95"
            >
              Set Up Your Switch
            </button>
          </div>
        </div>
      </section>

      {/* Create Switch Form Section */}
      {isCreating && (
        <section className="px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            <CreateSwitchForm
              onSubmit={handleCreateSwitch}
              onCancel={() => setIsCreating(false)}
            />
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-20 px-4" style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.4)', 
        margin: '3rem 0',
        borderRadius: '2rem',
        backdropFilter: 'blur(10px)'
      }}>
        <FeaturesSection />
      </section>

      {/* Active Switches Section */}
      <section className="py-20 px-4" style={{ margin: '4rem 0' }}>
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 style={{ 
              color: 'white', 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1.5rem',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
            }}>
              Active Switches ({activeSwitches.length})
            </h2>
            <p style={{ 
              color: '#bfdbfe', 
              fontSize: '1.25rem', 
              maxWidth: '48rem',
              margin: '0 auto',
              lineHeight: '1.6'
            }}>
              Monitor and manage your active safety switches
            </p>
          </div>
          
          {switches.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {switches.map((switch_) => (
                <SwitchCard
                  key={switch_.id}
                  switch_={switch_}
                  onCheckIn={checkIn}
                  onDelete={deleteSwitch}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
