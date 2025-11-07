import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, CheckCircle, CurrencyDollar, UsersFour, Hospital, Clock, TrendUp, XCircle } from '@phosphor-icons/react'
import { DashboardStats, Claim, ClaimStatus } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { dashboardApi, claimsApi, approvalsApi, membersApi, providersApi } from '@/services/api'
import { toast } from 'sonner'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface ClaimDistribution {
  name: string
  value: number
  color: string
}

export function Dashboard() {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
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
  const [claimDistribution, setClaimDistribution] = useState<ClaimDistribution[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, claimsData, approvalsData, membersData, providersData] = await Promise.allSettled([
          dashboardApi.getStats(),
          claimsApi.getAll(),
          approvalsApi.getAll(),
          membersApi.getAll(),
          providersApi.getAll(),
        ])

        if (statsData.status === 'fulfilled') {
          setStats(statsData.value)
        } else {
          const [claimsResult, approvalsResult, membersResult, providersResult] = [
            claimsData,
            approvalsData,
            membersData,
            providersData,
          ]

          const claims = claimsResult.status === 'fulfilled' ? (Array.isArray(claimsResult.value) ? claimsResult.value : claimsResult.value.content || []) : []
          const approvals = approvalsResult.status === 'fulfilled' ? (Array.isArray(approvalsResult.value) ? approvalsResult.value : approvalsResult.value.content || []) : []
          const members = membersResult.status === 'fulfilled' ? (Array.isArray(membersResult.value) ? membersResult.value : membersResult.value.content || []) : []
          const providers = providersResult.status === 'fulfilled' ? (Array.isArray(providersResult.value) ? providersResult.value : providersResult.value.content || []) : []

          const pendingClaims = claims.filter((c: Claim) => c.status === 'PENDING').length
          const approvedClaims = claims.filter((c: Claim) => c.status === 'APPROVED' || c.status === 'PAID').length
          const totalAmount = claims.reduce((sum: number, c: Claim) => sum + (c.approvedAmount || c.amount || 0), 0)
          const pendingApprovals = approvals.filter((a: any) => a.status === 'PENDING').length
          const activeProviders = providers.filter((p: any) => p.status === 'ACTIVE').length

          setStats({
            totalClaims: claims.length,
            pendingClaims,
            approvedClaims,
            totalAmount,
            totalMembers: members.length,
            activeProviders,
            pendingApprovals,
            overdueInvoices: 0,
          })
        }

        if (claimsData.status === 'fulfilled') {
          const claims: Claim[] = Array.isArray(claimsData.value) ? claimsData.value : claimsData.value.content || []
          
          const statusCounts: Record<string, number> = {
            PENDING: 0,
            APPROVED: 0,
            REJECTED: 0,
          }

          claims.forEach((claim: Claim) => {
            if (claim.status === 'PENDING' || claim.status === 'IN_REVIEW') {
              statusCounts.PENDING++
            } else if (claim.status === 'APPROVED' || claim.status === 'PAID' || claim.status === 'CLOSED') {
              statusCounts.APPROVED++
            } else if (claim.status === 'REJECTED') {
              statusCounts.REJECTED++
            }
          })

          setClaimDistribution([
            { name: 'Pending', value: statusCounts.PENDING, color: 'oklch(0.70 0.15 45)' },
            { name: 'Approved', value: statusCounts.APPROVED, color: 'oklch(0.60 0.15 145)' },
            { name: 'Rejected', value: statusCounts.REJECTED, color: 'oklch(0.577 0.245 27.325)' },
          ])
        }

      } catch (error: any) {
        console.error('Failed to load dashboard data:', error)
        
        if (error.status === 401) {
          toast.error('Session expired. Please login again.')
          logout()
        } else {
          toast.error('Failed to load dashboard data')
        }
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [logout])

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
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      show: ['ADMIN', 'INSURANCE', 'PROVIDER'],
    },
    {
      title: 'Pending Claims',
      value: stats.pendingClaims.toLocaleString(),
      icon: Clock,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
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
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toLocaleString(),
      icon: TrendUp,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      show: ['ADMIN', 'INSURANCE', 'PROVIDER'],
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
      title: 'Total Amount',
      value: formatCurrency(stats.totalAmount),
      icon: CurrencyDollar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      show: ['ADMIN', 'INSURANCE'],
    },
    {
      title: 'Overdue Invoices',
      value: stats.overdueInvoices.toLocaleString(),
      icon: XCircle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
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
          <h1 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('common.loading')}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
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

  const totalDistribution = claimDistribution.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('dashboard.welcome')}, {user?.name}
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

      {totalDistribution > 0 && (user?.role === 'ADMIN' || user?.role === 'INSURANCE') && (
        <Card>
          <CardHeader>
            <CardTitle>Claims Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={claimDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {claimDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

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