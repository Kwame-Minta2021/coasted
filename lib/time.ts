// Firebase Timestamp removed for UI-only demo
// Using regular Date objects instead

export interface ScheduleWindow {
  day: number; // 0-6 (Sunday = 0)
  start: string; // "HH:mm" format
  end: string; // "HH:mm" format
}

export interface ScreenTimeConfig {
  dailyLimitMinutes: number;
  schedule?: ScheduleWindow[];
  blockedRoutes?: string[];
}

export interface FocusTimeConfig {
  enabled: boolean;
  defaultSessionMinutes: number;
  allowedRoutes?: string[];
}

export interface ActiveFocusSession {
  startedAt: Date;
  endsAt: Date;
}

export interface UsageToday {
  minutesConsumed: number;
  updatedAt: Date;
}

export interface ChildDocument {
  guardianId: string;
  displayName: string;
  dob?: string;
  screenTime: ScreenTimeConfig;
  focusTime: FocusTimeConfig;
  activeFocusSession?: ActiveFocusSession;
  usageToday: UsageToday;
}

/**
 * Check if current time is within allowed schedule windows
 */
export function isWithinSchedule(schedule: ScheduleWindow[] | undefined, now: Date = new Date()): boolean {
  if (!schedule || schedule.length === 0) {
    return true; // No schedule means always allowed
  }

  const currentDay = now.getDay();
  const currentTime = now.toTimeString().slice(0, 5); // "HH:mm" format

  return schedule.some(window => {
    if (window.day !== currentDay) return false;
    
    return currentTime >= window.start && currentTime <= window.end;
  });
}

/**
 * Calculate remaining daily minutes for a child
 */
export function remainingDailyMinutes(
  childDoc: ChildDocument,
  usageToday: UsageToday,
  now: Date = new Date()
): number {
  // Check if it's a new day (reset usage)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const usageDate = new Date(usageToday.updatedAt.getFullYear(), usageToday.updatedAt.getMonth(), usageToday.updatedAt.getDate());
  
  const currentUsage = today.getTime() === usageDate.getTime() ? usageToday.minutesConsumed : 0;
  const limit = childDoc.screenTime.dailyLimitMinutes;
  
  return Math.max(0, limit - currentUsage);
}

/**
 * Check if a route is allowed based on current focus session and blocked routes
 */
export function canUseRoute(
  childDoc: ChildDocument,
  pathname: string,
  now: Date = new Date()
): { allowed: boolean; reason?: string; remainingTime?: number } {
  // Check if focus session is active
  if (childDoc.activeFocusSession) {
    const sessionEnd = childDoc.activeFocusSession.endsAt instanceof Date 
      ? childDoc.activeFocusSession.endsAt 
      : new Date(childDoc.activeFocusSession.endsAt);
    if (now < sessionEnd) {
      // Focus session is active - check whitelist
      const allowedRoutes = childDoc.focusTime.allowedRoutes || ['/child'];
      if (!allowedRoutes.some(route => pathname.startsWith(route))) {
        return { 
          allowed: false, 
          reason: 'focus',
          remainingTime: Math.max(0, sessionEnd.getTime() - now.getTime())
        };
      }
    }
  }

  // Check if daily limit is exceeded
  const remaining = remainingDailyMinutes(childDoc, childDoc.usageToday, now);
  if (remaining <= 0) {
    return { 
      allowed: false, 
      reason: 'limit',
      remainingTime: 0
    };
  }

  // Check blocked routes
  const blockedRoutes = childDoc.screenTime.blockedRoutes || [];
  if (blockedRoutes.some(route => pathname.startsWith(route))) {
    return { 
      allowed: false, 
      reason: 'blocked',
      remainingTime: remaining
    };
  }

  return { allowed: true, remainingTime: remaining };
}

/**
 * Calculate time until midnight (when daily usage resets)
 */
export function timeUntilMidnight(now: Date = new Date()): number {
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return midnight.getTime() - now.getTime();
}

/**
 * Format milliseconds to MM:SS
 */
export function formatTimeRemaining(milliseconds: number): string {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Format minutes to human readable string
 */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
}

/**
 * Create a new focus session
 */
export function createFocusSession(durationMinutes: number, now: Date = new Date()): ActiveFocusSession {
  const startedAt = new Date(now);
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000);
  
  return {
    startedAt: startedAt,
    endsAt: endsAt
  };
}

/**
 * Validate schedule windows
 */
export function validateSchedule(schedule: ScheduleWindow[]): string[] {
  const errors: string[] = [];
  
  schedule.forEach((window, index) => {
    if (window.day < 0 || window.day > 6) {
      errors.push(`Window ${index + 1}: Day must be 0-6`);
    }
    
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(window.start)) {
      errors.push(`Window ${index + 1}: Invalid start time format (HH:mm)`);
    }
    
    if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(window.end)) {
      errors.push(`Window ${index + 1}: Invalid end time format (HH:mm)`);
    }
    
    if (window.start >= window.end) {
      errors.push(`Window ${index + 1}: Start time must be before end time`);
    }
  });
  
  return errors;
}

/**
 * Get day name from day number
 */
export function getDayName(day: number): string {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day] || 'Unknown';
}
