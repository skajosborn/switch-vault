import { useState, useEffect } from 'react';
import { DeadMansSwitch } from '@/types';
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
        // Convert string dates back to Date objects
        const switchesWithDates = parsed.map((sw: any) => ({
          ...sw,
          lastCheckIn: sw.lastCheckIn ? new Date(sw.lastCheckIn) : null,
          expiresAt: sw.expiresAt ? new Date(sw.expiresAt) : null,
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

  const createSwitch = (message: string, checkInInterval: number) => {
    const newSwitch: DeadMansSwitch = {
      id: Date.now().toString(),
      message: message.trim(),
      checkInInterval,
      lastCheckIn: new Date(),
      isActive: true,
      expiresAt: addHours(new Date(), checkInInterval),
    };

    setSwitches(prev => [...prev, newSwitch]);
    return newSwitch;
  };

  const checkIn = (id: string) => {
    setSwitches(prev => prev.map(sw => {
      if (sw.id === id) {
        return {
          ...sw,
          lastCheckIn: new Date(),
          expiresAt: addHours(new Date(), sw.checkInInterval),
        };
      }
      return sw;
    }));
  };

  const deleteSwitch = (id: string) => {
    setSwitches(prev => prev.filter(sw => sw.id !== id));
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
  };
}
