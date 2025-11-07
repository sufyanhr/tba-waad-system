import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, MagnifyingGlass, Eye } from '@phosphor-icons/react'
import { Claim, ClaimStatus } from '@/types'
import { useAuth } from '@/contexts/AuthContext'
import { ClaimDialog } from './ClaimDialog'
import { ClaimViewDialog } from './ClaimViewDialog'
import { claimsApi } from '@/services/api'
import { toast } from 'sonner'

export function Claims() {
  const { t } = useTranslation()
  const { user, hasRole } = useAuth()
  const [claims, setClaims] = useState<Claim[]>([])
  const [filteredClaims, setFilteredClaims] = useState<Claim[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<Claim | undefined>()

  useEffect(() => {
    loadClaims()
  }, [])

  useEffect(() => {
    filterClaims()
  }, [claims, searchTerm, statusFilter])

  const loadClaims = async () => {
    try {
      const params = statusFilter !== 'ALL' ? { status: statusFilter } : {}
      const data = await claimsApi.getAll(params)
      setClaims(Array.isArray(data) ? data : data.content || [])
    } catch (error: any) {
      console.error('Failed to load claims:', error)
      toast.error('Failed to load claims')
    } finally {
      setLoading(false)
    }
  }

  const filterClaims = () => {
    let filtered = [...claims]

    if (searchTerm) {
      filtered = filtered.filter(
        (claim) =>
          claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.providerName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((claim) => claim.status === statusFilter)
    }

    setFilteredClaims(filtered)
  }

  const handleSave = async (claim: Claim) => {
    try {
      if (claim.id && claim.id.startsWith('temp-')) {
        await claimsApi.create(claim)
        toast.success('Claim created successfully')
      } else {
        await claimsApi.update(claim.id, claim)
        toast.success('Claim updated successfully')
      }
      await loadClaims()
      setDialogOpen(false)
      setSelectedClaim(undefined)
    } catch (error: any) {
      console.error('Failed to save claim:', error)
      toast.error('Failed to save claim')
    }
  }

  const getStatusColor = (status: ClaimStatus) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      IN_REVIEW: 'bg-blue-100 text-blue-800 border-blue-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
      PAID: 'bg-purple-100 text-purple-800 border-purple-200',
      CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
    }
    return colors[status]
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleView = (claim: Claim) => {
    setSelectedClaim(claim)
    setViewDialogOpen(true)
  }

  const handleEdit = (claim: Claim) => {
    setSelectedClaim(claim)
    setDialogOpen(true)
  }

  const canCreateClaim = hasRole(['ADMIN', 'INSURANCE', 'PROVIDER'])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{t('claims.title')}</h1>
            <p className="text-muted-foreground mt-1">{t('common.loading')}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{t('claims.title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('claims.title')}
          </p>
        </div>
        {canCreateClaim && (
          <Button onClick={() => setDialogOpen(true)}>
            <Plus size={18} className="mr-2" />
            {t('claims.newClaim')}
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('claims.title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-3 text-muted-foreground" size={18} />
              <Input
                placeholder={t('claims.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('claims.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">{t('claims.status')}</SelectItem>
                <SelectItem value="PENDING">{t('claims.pending')}</SelectItem>
                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                <SelectItem value="APPROVED">{t('claims.approved')}</SelectItem>
                <SelectItem value="REJECTED">{t('claims.rejected')}</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim Number</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Service Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClaims.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No claims found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClaims.map((claim) => (
                    <TableRow key={claim.id}>
                      <TableCell className="font-mono text-sm">{claim.claimNumber}</TableCell>
                      <TableCell>{claim.memberName}</TableCell>
                      <TableCell>{claim.providerName}</TableCell>
                      <TableCell>{formatDate(claim.serviceDate)}</TableCell>
                      <TableCell>{formatCurrency(claim.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(claim.status)}>
                          {claim.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(claim)}
                          >
                            <Eye size={16} />
                          </Button>
                          {canCreateClaim && claim.status === 'PENDING' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(claim)}
                            >
                              Review
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ClaimDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        claim={selectedClaim}
        onSave={handleSave}
      />

      <ClaimViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        claim={selectedClaim}
      />
    </div>
  )
}