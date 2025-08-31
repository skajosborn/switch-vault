'use client';

import { Clock, AlertTriangle, CheckCircle, XCircle, Bell, Zap, Shield, Users } from 'lucide-react';
import { DeadMansSwitch } from '@/types';
import { getTimeRemaining, getStatusColor, formatDateTime } from '@/utils/dateUtils';

interface SwitchCardProps {
  switch_: DeadMansSwitch;
  onCheckIn: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function SwitchCard({ switch_, onCheckIn, onDelete }: SwitchCardProps) {
  // Switch card styles with !important to override conflicts
  const switchCardStyle = {
    backgroundColor: '#1e40af !important',
    border: '2px solid #2563eb !important',
    borderRadius: '0.75rem !important',
    boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3) !important',
    transition: 'all 0.3s ease !important',
    padding: '2rem !important',
    margin: '1rem 0 !important'
  };

  const getStatusIcon = () => {
    if (!switch_.isActive) return <AlertTriangle className="w-5 h-5 text-slate-400" />;
    if (switch_.expiresAt && new Date() > switch_.expiresAt) {
      return <XCircle className="w-5 h-5 text-red-400" />;
    }
    return <CheckCircle className="w-5 h-5 text-green-400" />;
  };

  const getStatusText = () => {
    if (switch_.isActive && switch_.expiresAt && new Date() > switch_.expiresAt) {
      return 'EXPIRED';
    }
    if (switch_.isActive) return 'ACTIVE';
    return 'INACTIVE';
  };

  const getBorderColor = () => {
    if (switch_.isActive && switch_.expiresAt && new Date() > switch_.expiresAt) {
      return 'border-red-500/50';
    }
    if (switch_.isActive) return 'border-green-500/50';
    return 'border-slate-500/30';
  };

  const getStatusColorClass = (switch_: DeadMansSwitch) => {
    if (!switch_.isActive) return 'text-slate-400';
    if (switch_.expiresAt && new Date() > switch_.expiresAt) {
      return 'text-red-400';
    }
    if (switch_.isActive) return 'text-green-400';
    return 'text-blue-400';
  };

  const getNotificationCount = () => {
    if (!switch_.notifications) return 0;
    return Object.values(switch_.notifications).filter(Boolean).length;
  };

  return (
    <div style={switchCardStyle} className={`border-l-4 ${getBorderColor()}`}>
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          {/* Status Badge and Plan Name */}
          <div className="flex items-center gap-3 mb-4">
            {getStatusIcon()}
            <span className={`font-semibold text-lg px-3 py-1 rounded-full bg-slate-700/50 border border-slate-600/30 ${getStatusColorClass(switch_)}`}>
              {getStatusText()}
            </span>
            {switch_.planName && (
              <span className="text-slate-300 text-sm px-3 py-1 rounded-full bg-slate-700/30 border border-slate-600/20">
                {switch_.planName}
              </span>
            )}
          </div>
          
          {/* Message */}
          <div className="mb-6">
            <p style={{ 
              color: 'white', 
              fontSize: '1.25rem', 
              lineHeight: '1.5',
              fontWeight: '500'
            }}>
              {switch_.message}
            </p>
          </div>
          
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600/20 rounded-lg border border-blue-600/30">
                <Clock className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                  Check-in every {switch_.checkInInterval}h
                </span>
                {switch_.gracePeriod && (
                  <div>
                    <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                      +{switch_.gracePeriod}h grace period
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                Last check-in:
              </span>
              <br />
              <span style={{ color: '#dbeafe', fontSize: '0.875rem' }}>
                {switch_.lastCheckIn
                  ? formatDateTime(switch_.lastCheckIn)
                  : 'Never'}
              </span>
            </div>
            
            <div>
              <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                Next deadline:
              </span>
              <br />
              <span style={{ color: '#dbeafe', fontSize: '0.875rem' }}>
                {switch_.expiresAt
                  ? formatDateTime(switch_.expiresAt)
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Customization Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Reminders */}
            {switch_.reminders && (
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                <div className="p-2 bg-yellow-600/20 rounded-lg border border-yellow-600/30">
                  <Bell className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                    Reminders: {switch_.reminders.enabled ? 'ON' : 'OFF'}
                  </span>
                  {switch_.reminders.enabled && (
                    <div>
                      <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                        {switch_.reminders.frequency} • {switch_.reminders.advanceWarning}h warning
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notifications */}
            {switch_.notifications && (
              <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                <div className="p-2 bg-green-600/20 rounded-lg border border-green-600/30">
                  <Zap className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                    Notifications: {getNotificationCount()} channels
                  </span>
                  <br />
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                    {switch_.autoRenewal ? 'Auto-renewal ON' : 'Auto-renewal OFF'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Emergency Contacts and Custom Actions */}
          {(switch_.emergencyContacts?.length > 0 || switch_.customActions?.length > 0) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {switch_.emergencyContacts && switch_.emergencyContacts.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                  <div className="p-2 bg-red-600/20 rounded-lg border border-red-600/30">
                    <Users className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                      Emergency Contacts: {switch_.emergencyContacts.length}
                    </span>
                  </div>
                </div>
              )}

              {switch_.customActions && switch_.customActions.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600/20">
                  <div className="p-2 bg-orange-600/20 rounded-lg border border-orange-600/30">
                    <Shield className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <span style={{ color: '#bfdbfe', fontSize: '0.875rem', fontWeight: '500' }}>
                      Custom Actions: {switch_.customActions.length}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Actions Section */}
      <div className="flex gap-4 mb-6">
        {switch_.isActive && (
          <button
            onClick={() => onCheckIn(switch_.id)}
            style={{
              background: 'linear-gradient(135deg, rgb(37, 99, 235) 0%, rgb(6, 182, 212) 100%)',
              color: 'white',
              fontWeight: '600',
              transition: 'all 0.3s',
              transform: 'scale(1)',
              boxShadow: '0 10px 25px -5px rgba(37, 99, 235, 0.4)',
              border: 'none'
            }}
            className="px-6 py-3 rounded-xl font-semibold"
          >
            Check In
          </button>
        )}
        
        <button
          onClick={() => onDelete(switch_.id)}
          className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 border border-slate-500/30"
        >
          Delete
        </button>
      </div>
      
      {/* Time Remaining Section */}
      {switch_.isActive && switch_.expiresAt && (
        <div className="p-4 bg-slate-700/30 rounded-xl border border-slate-600/30">
          <div className="flex items-center justify-between">
            <span style={{ 
              color: '#bfdbfe', 
              fontSize: '0.875rem', 
              fontWeight: '500' 
            }}>
              Time remaining:
            </span>
            <span style={{ 
              color: getStatusColorClass(switch_) === 'text-red-400' ? '#fca5a5' : 
                     getStatusColorClass(switch_) === 'text-green-400' ? '#86efac' : '#94a3b8',
              fontSize: '1.25rem', 
              fontWeight: 'bold' 
            }}>
              {getTimeRemaining(switch_.expiresAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
