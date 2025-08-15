export const getTimeRemaining = (expiresAt: Date): string => {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) return 'Expired';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const getStatusColor = (switch_: { isActive: boolean; expiresAt: Date | null }): string => {
  if (!switch_.isActive) return 'text-gray-500';
  if (!switch_.expiresAt) return 'text-blue-500';
  
  const timeRemaining = new Date().getTime() - switch_.expiresAt.getTime();
  if (timeRemaining > 0) return 'text-red-500';
  if (timeRemaining > -3600000) return 'text-yellow-500'; // Within 1 hour
  return 'text-green-500';
};

export const formatDateTime = (date: Date): string => {
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

export const addHours = (date: Date, hours: number): Date => {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
};
