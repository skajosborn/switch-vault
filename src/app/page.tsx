'use client';

import SwitchCard from '@/components/SwitchCard';
import EmptyState from '@/components/EmptyState';
import FeaturesSection from '@/components/FeaturesSection';
import { useDeadMansSwitches } from '@/hooks/useDeadMansSwitches';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { user, token, loading } = useAuth();
  const { switches, activeSwitches, checkIn, deleteSwitch } = useDeadMansSwitches();

  const handleCreateSwitch = () => {
    // Add some debugging
    console.log('Create switch clicked. Token:', token, 'Loading:', loading, 'User:', user);
    
    if (loading) {
      console.log('Still loading, waiting...');
      return; // Don't do anything while loading
    }
    
    if (token) {
      console.log('User is authenticated, redirecting to setup');
      router.push('/setup');
    } else {
      console.log('User is not authenticated, redirecting to login');
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
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
            Final Switch
          </h1>
          <div className="flex justify-center pb-16 p-6">
              <img 
                src="/sandtimer.png" 
                alt="Safety Net Dashboard Preview" 
                className="rounded-lg shadow-2xl border border-blue-500/20"
                style={{
                  maxWidth: '600px',
                  height: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-lg"></div>
            </div>
          <p style={{ 
            color: '#dbeafe', 
            fontSize: '1.5rem', 
            maxWidth: '64rem', 
            margin: '0 auto 3rem auto', 
            lineHeight: '1.6',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}>
            "Peace of mind, automated. Life is unpredictable, but your plans don't have to be. Our customizable Dead Man's Switch puts you in control — set your own check-in schedule, choose alerts and reminders, and decide exactly what happens if you don't respond. Whether it's protecting important files, sending final messages, or transferring digital assets, we ensure your wishes are carried out—securely, automatically, and on your terms."
          </p>
          
          {/* CTA Button Container */}
          <div className="max-w-lg mx-auto bg-blue-600 border-2 border-blue-500 rounded-2xl shadow-2xl p-6 md:p-10 m-4 md:m-8">
            <button
              onClick={handleCreateSwitch}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg text-base md:text-lg cursor-pointer border-2 border-transparent hover:border-white focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ position: 'relative', zIndex: 10 }}
            >
              {loading ? 'Loading...' : 'Set Up Your Switch'}
            </button>
          </div>
          

          
          {/* Hero Image */}
          <div className="mt-12 flex justify-center">
            {/* <div className="relative bg-slate-900/50 backdrop-blur-sm border border-blue-600/30 rounded-xl shadow-2xl p-6">
              <img 
                src="/sandtimer.png" 
                alt="Safety Net Dashboard Preview" 
                className="rounded-lg shadow-2xl border border-blue-500/20"
                style={{
                  maxWidth: '600px',
                  height: 'auto',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent rounded-lg"></div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Create Switch Form Section */}
      {/* Removed as per edit hint */}

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
