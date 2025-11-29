export interface Session {
  id: string;
  date: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
}

const STORAGE_KEY = 'everbreathe_sessions';

export function getTodaySessions(): Session[] {
  if (typeof window === 'undefined') return [];
  
  const today = new Date().toISOString().split('T')[0];
  const allSessions = getAllSessions();
  return allSessions.filter(session => session.date === today);
}

export function getAllSessions(): Session[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addSession(session: Session): void {
  if (typeof window === 'undefined') return;
  
  const sessions = getAllSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

export function completeSession(sessionId: string): void {
  if (typeof window === 'undefined') return;
  
  const sessions = getAllSessions();
  const session = sessions.find(s => s.id === sessionId);
  if (session) {
    session.completed = true;
    session.endTime = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }
}

export function getSessionCountToday(): number {
  return getTodaySessions().filter(s => s.completed).length;
}

export function canStartNewSession(): boolean {
  return getSessionCountToday() < 3;
}

