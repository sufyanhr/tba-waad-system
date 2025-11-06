import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, CurrencyDollar, UsersFour, Hospital, Clock, TrendUp } from '@phosphor-icons/react'
import { DashboardStats } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

export function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalClaims: 0,
    pendingClaims: 0,
    approvedClaims: 0,
    totalAmount: 0,
    totalMembers: 0,
    activeProviders: 0,
    pendingApprovals: 0,
    overdueInvoices: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const claims = await window.spark.kv.get<any[]>('claims') || []
        const members = await window.spark.kv.get<any[]>('members') || []
        const providers = await window.spark.kv.get<any[]>('providers') || []
        const approvals = await window.spark.kv.get<any[]>('approvals') || []
        const invoices = await window.spark.kv.get<any[]>('invoices') || []

        setStats({
          totalClaims: claims.length,
          pendingClaims: claims.filter(c => c.status === 'PENDING' || c.status === 'IN_REVIEW').length,
          approvedClaims: claims.filter(c => c.status === 'APPROVED' || c.status === 'PAID').length,
          totalAmount: claims.reduce((sum, c) => sum + (c.approvedAmount || c.amount), 0),
          totalMembers: members.filter(m => m.status === 'ACTIVE').length,
          activeProviders: providers.filter(p => p.status === 'ACTIVE').length,
          pendingApprovals: approvals.filter(a => a.status === 'PENDING').length,
          overdueInvoices: invoices.filter(i => i.status === 'OVERDUE').length,
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const statCards = [
    {
      title: 'Total Claims',
      value: stats.totalClaims.toLocaleString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      show: ['ADMIN', 'INSURANCE', 'PROVIDER'],
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims.toLocaleString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      show: ['ADMIN', 'INSURANCE', 'PROVIDER'],
    },
    {
      title: 'Approved Claims',
      value: stats.approvedClaims.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      show: ['ADMIN', 'INSURANCE'],
    },
    {
      title: 'Total Amount',
      value: formatCurrency(stats.totalAmount),
      icon: CurrencyDollar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      show: ['ADMIN', 'INSURANCE'],
    },
    {
      title: 'Active Members',
      value: stats.totalMembers.toLocaleString(),
      icon: UsersFour,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      show: ['ADMIN', 'INSURANCE', 'EMPLOYER'],
    },
    {
      title: 'Active Providers',
      value: stats.activeProviders.toLocaleString(),
      icon: Hospital,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      show: ['ADMIN', 'INSURANCE'],
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toLocaleString(),
      icon: TrendUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      show: ['ADMIN', 'INSURANCE', 'PROVIDER'],
    },
    {
      title: 'Overdue Invoices',
      value: stats.overdueInvoices.toLocaleString(),
      icon: CurrencyDollar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      show: ['ADMIN', 'INSURANCE', 'PROVIDER'],
    },
  ]

  const visibleStats = statCards.filter(card => 
    card.show.includes(user?.role || '')
  )

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Loading your overview...</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-3">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {user?.name}. Here's your overview.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {visibleStats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon size={20} weight="bold" className={stat.color} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a module from the sidebar to get started with managing your healthcare operations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}