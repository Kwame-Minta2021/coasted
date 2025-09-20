import RequireStudent from '@/components/RequireStudent'
import DashboardShell from '@/components/DashboardShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireStudent>
      <DashboardShell>{children}</DashboardShell>
    </RequireStudent>
  )
}
