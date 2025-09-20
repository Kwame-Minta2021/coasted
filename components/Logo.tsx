export default function Logo({ className = 'h-9 w-auto' }: { className?: string }) {
  return (
    <img
      src="/logo1.png"
      alt="Coasted Code"
      className={className}
      loading="eager"
      decoding="sync"
    />
  )
}
