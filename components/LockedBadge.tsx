export default function LockedBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-100 rounded-full text-xs font-medium transition-colors duration-300">
      <span>🔒</span>
      <span>Locked — pay to unlock</span>
    </div>
  )
}
