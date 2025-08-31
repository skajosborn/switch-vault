import { useState, useEffect } from 'react';
import { DeadMansSwitch, CreateSwitchFormData } from '@/types';
import { addHours } from '@/utils/dateUtils';

const STORAGE_KEY = 'deadMansSwitches';

export function useDeadMansSwitches() {
  const [switches, setSwitches] = useState<DeadMansSwitch[]>([]);

  // Load switches from localStorage on component mount
  useEffect(() => {
    const savedSwitches = localStorage.getItem(STORAGE_KEY);
    if (savedSwitches) {
      try {
        const parsed = JSON.parse(savedSwitches);
        // Convert string dates back to Date objects and handle legacy data
        const switchesWithDates = parsed.map((sw: any) => ({
          id: sw.id,
          message: sw.message,
          checkInInterval: sw.checkInInterval,
          lastCheckIn: sw.lastCheckIn ? new Date(sw.lastCheckIn) : null,
          isActive: sw.isActive,
          expiresAt: sw.expiresAt ? new Date(sw.expiresAt) : null,
          // Handle new fields with defaults for legacy data
          planName: sw.planName || 'My Safety Switch',
          gracePeriod: sw.gracePeriod || 12,
          reminders: sw.reminders || {
            enabled: true,
            frequency: 'daily',
            advanceWarning: 24,
            customMessage: ''
          },
          notifications: sw.notifications || {
            email: true,
            sms: false,
            push: true,
            slack: false,
            discord: false
          },
          autoRenewal: sw.autoRenewal !== undefined ? sw.autoRenewal : true,
          emergencyContacts: sw.emergencyContacts || [],
          customActions: sw.customActions || []
        }));
        setSwitches(switchesWithDates);
      } catch (error) {
        console.error('Error loading switches from localStorage:', error);
      }
    }
  }, []);

  // Save switches to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(switches));
    } catch (error) {
      console.error('Error saving switches to localStorage:', error);
    }
  }, [switches]);

  // Check for expired switches every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setSwitches(prev => prev.map(sw => {
        if (sw.isActive && sw.expiresAt && new Date() > sw.expiresAt) {
          return { ...sw, isActive: false };
        }
        return sw;
      }));
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const createSwitch = (formData: CreateSwitchFormData) => {
    const newSwitch: DeadMansSwitch = {
      id: Date.now().toString(),
      message: formData.message.trim(),
      checkInInterval: formData.checkInInterval,
      lastCheckIn: new Date(),
      isActive: true,
      expiresAt: addHours(new Date(), formData.checkInInterval + formData.gracePeriod),
      planName: formData.planName,
      gracePeriod: formData.gracePeriod,
      reminders: formData.reminders,
      notifications: formData.notifications,
      autoRenewal: formData.autoRenewal,
      emergencyContacts: formData.emergencyContacts,
      customActions: formData.customActions
    };

    setSwitches(prev => [...prev, newSwitch]);
    return newSwitch;
  };

  const checkIn = (id: string) => {
    setSwitches(prev => prev.map(sw => {
      if (sw.id === id) {
        const newExpiry = addHours(new Date(), sw.checkInInterval + sw.gracePeriod);
        return {
          ...sw,
          lastCheckIn: new Date(),
          expiresAt: newExpiry,
        };
      }
      return sw;
    }));
  };

  const deleteSwitch = (id: string) => {
    setSwitches(prev => prev.filter(sw => sw.id !== id));
  };

  const updateSwitch = (id: string, updates: Partial<DeadMansSwitch>) => {
    setSwitches(prev => prev.map(sw => {
      if (sw.id === id) {
        const updated = { ...sw, ...updates };
        // Recalculate expiry if check-in interval or grace period changed
        if (updates.checkInInterval || updates.gracePeriod) {
          updated.expiresAt = addHours(new Date(), updated.checkInInterval + updated.gracePeriod);
        }
        return updated;
      }
      return sw;
    }));
  };

  const getActiveSwitches = () => switches.filter(s => s.isActive);
  const getExpiredSwitches = () => switches.filter(s => !s.isActive);

  return {
    switches,
    activeSwitches: getActiveSwitches(),
    expiredSwitches: getExpiredSwitches(),
    createSwitch,
    checkIn,
    deleteSwitch,
    updateSwitch,
  };
}
