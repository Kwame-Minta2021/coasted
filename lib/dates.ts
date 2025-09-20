// Always parse as UTC and format consistently (prevents SSR/CSR mismatch)
function toUTCDate(iso: string) {
    // Expecting 'YYYY-MM-DD' or full ISO; fallback if needed
    if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
      const [y, m, d] = iso.split('-').map(Number)
      return new Date(Date.UTC(y, m - 1, d))
    }
    const d = new Date(iso)
    // Force to same wall-clock date in UTC
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  }
  
  export function formatDate(iso: string) {
    const d = toUTCDate(iso)
    const dd = String(d.getUTCDate()).padStart(2, '0')
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0')
    const yyyy = d.getUTCFullYear()
    // Choose ONE canonical format for the whole app:
    return `${dd}/${mm}/${yyyy}` // 15/09/2025
  }
  
  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
  export function formatMonthYear(iso: string) {
    const d = toUTCDate(iso)
    return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}` // e.g., September 2025
  }
  