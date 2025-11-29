const REMINDER_KEY = 'everbreathe_reminders';
const REMINDER_TIMES = ['09:00', '14:00', '20:00']; // 9 AM, 2 PM, 8 PM

export interface ReminderSettings {
  enabled: boolean;
  times: string[];
}

export function getReminderSettings(): ReminderSettings {
  if (typeof window === 'undefined') {
    return { enabled: false, times: REMINDER_TIMES };
  }
  
  try {
    const stored = localStorage.getItem(REMINDER_KEY);
    return stored ? JSON.parse(stored) : { enabled: true, times: REMINDER_TIMES };
  } catch {
    return { enabled: true, times: REMINDER_TIMES };
  }
}

export function setReminderSettings(settings: ReminderSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REMINDER_KEY, JSON.stringify(settings));
}

export function checkReminderTime(): boolean {
  if (typeof window === 'undefined') return false;
  
  const settings = getReminderSettings();
  if (!settings.enabled) return false;
  
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  return settings.times.some(time => {
    const [hour, minute] = time.split(':').map(Number);
    const reminderTime = new Date();
    reminderTime.setHours(hour, minute, 0, 0);
    
    const diff = Math.abs(now.getTime() - reminderTime.getTime());
    return diff < 5 * 60 * 1000; // 5 minute window
  });
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return Promise.resolve('denied');
  }
  
  if (Notification.permission === 'granted') {
    return Promise.resolve('granted');
  }
  
  return Notification.requestPermission();
}

export function showReminderNotification(): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }
  
  if (Notification.permission === 'granted') {
    new Notification('Everbreathe', {
      body: 'Time for your breathing exercise! Take 5 minutes to practice the 356 method.',
      icon: '/favicon.svg',
      tag: 'breathforge-reminder'
    });
  }
}

