const KEY = 'screen_time_settings' // { minutesPerDay: number, pin?: string }
const DAY_KEY = 'screen_time_usage' // { yyyymmdd: number /* seconds used */ }

const todayKey = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth()+1).padStart(2,'0')
  const da = String(d.getDate()).padStart(2,'0')
  return `${y}${m}${da}`
}

export function getSettings() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') as { minutesPerDay?: number; pin?: string } }
  catch { return {} }
}
export function saveSettings(v: { minutesPerDay: number; pin?: string }) {
  localStorage.setItem(KEY, JSON.stringify(v))
}

export function getTodayUsedSeconds() {
  try {
    const all = JSON.parse(localStorage.getItem(DAY_KEY) || '{}')
    return Number(all[todayKey()] || 0)
  } catch { return 0 }
}
export function addUsageSeconds(sec: number) {
  const all = (() => { try { return JSON.parse(localStorage.getItem(DAY_KEY) || '{}') } catch { return {} } })()
  const k = todayKey()
  all[k] = Number(all[k] || 0) + Math.max(0, sec)
  localStorage.setItem(DAY_KEY, JSON.stringify(all))
}
export function resetToday() {
  const all = (() => { try { return JSON.parse(localStorage.getItem(DAY_KEY) || '{}') } catch { return {} } })()
  all[todayKey()] = 0
  localStorage.setItem(DAY_KEY, JSON.stringify(all))
}
