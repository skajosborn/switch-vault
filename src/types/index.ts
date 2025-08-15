export interface DeadMansSwitch {
  id: string;
  message: string;
  checkInInterval: number; // in hours
  lastCheckIn: Date | null;
  isActive: boolean;
  expiresAt: Date | null;
}

export interface CreateSwitchFormData {
  message: string;
  checkInInterval: number;
}
