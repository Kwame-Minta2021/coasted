export default function ProgressBar({ percent }: { percent: number }) {
  const p = Math.max(0, Math.min(100, Math.round(percent)))
  return (
    <div>
      <div className="flex items-end justify-between">
        <div className="text-sm font-semibold">Overall Progress</div>
        <div className="text-xs text-slate-500">{p}%</div>
      </div>
      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
        <div className="h-full rounded-full bg-blue-600 transition-[width] duration-500" style={{ width: `${p}%` }} />
      </div>
    </div>
  )
}
