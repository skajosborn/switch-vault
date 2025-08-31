export interface DeadMansSwitch {
  id: string;
  message: string;
  checkInInterval: number; // in hours
  lastCheckIn: Date | null;
  isActive: boolean;
  expiresAt: Date | null;
  // New customization fields
  planName: string;
  gracePeriod: number; // in hours
  reminders: ReminderSettings;
  notifications: NotificationSettings;
  autoRenewal: boolean;
  emergencyContacts: string[];
  customActions: CustomAction[];
}

export interface CreateSwitchFormData {
  message: string;
  checkInInterval: number;
  planName: string;
  gracePeriod: number;
  reminders: ReminderSettings;
  notifications: NotificationSettings;
  autoRenewal: boolean;
  emergencyContacts: string[];
  customActions: CustomAction[];
}

export interface ReminderSettings {
  enabled: boolean;
  frequency: 'hourly' | 'daily' | 'weekly';
  advanceWarning: number; // hours before deadline
  customMessage?: string;
}

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  push: boolean;
  slack: boolean;
  discord: boolean;
  customWebhook?: string;
}

export interface CustomAction {
  id: string;
  type: 'email' | 'sms' | 'webhook' | 'file_transfer' | 'crypto_transfer';
  name: string;
  config: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface SwitchPlanTemplate {
  id: string;
  name: string;
  description: string;
  checkInInterval: number;
  gracePeriod: number;
  reminders: ReminderSettings;
  notifications: NotificationSettings;
  autoRenewal: boolean;
  price?: number;
  features: string[];
  emergencyContacts: string[];
  customActions: CustomAction[];
}
