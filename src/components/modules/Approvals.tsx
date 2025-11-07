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
import { Eye } from '@phosphor-icons/react'
import { Approval, ApprovalStatus } from '@/types'
import { ApprovalViewDialog } from './ApprovalViewDialog'
import { MagnifyingGlass } from '@phosphor-icons/react'

export function Approvals() {
  const { t } = useTranslation()
  const [approvals, setApprovals] = useState<Approval[]>([])
  const [filteredApprovals, setFilteredApprovals] = useState<Approval[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedApproval, setSelectedApproval] = useState<Approval | undefined>()

  useEffect(() => {
    loadApprovals()
  }, [])

  useEffect(() => {
    filterApprovals()
  }, [approvals, searchTerm])

  const loadApprovals = async () => {
    try {
      const data = await window.spark.kv.get<Approval[]>('approvals') || []
      setApprovals(data)
    } catch (error) {
      console.error('Failed to load approvals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterApprovals = () => {
    let filtered = [...approvals]

    if (searchTerm) {
      filtered = filtered.filter(
        (approval) =>
          approval.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          approval.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          approval.procedure.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredApprovals(filtered)
  }

  const handleView = (approval: Approval) => {
    setSelectedApproval(approval)
    setViewDialogOpen(true)
  }

  const getStatusColor = (status: ApprovalStatus) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200',
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Pre-Authorizations</h1>
            <p className="text-muted-foreground mt-1">Loading approvals...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Pre-Authorizations</h1>
          <p className="text-muted-foreground mt-1">
            Manage pre-authorization requests for medical procedures
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Pre-Authorization Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <MagnifyingGlass className="absolute left-3 top-3 text-muted-foreground" size={18} />
            <Input
              placeholder="Search by request number, member, or procedure..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request Number</TableHead>
                  <TableHead>Member</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Procedure Date</TableHead>
                  <TableHead>Estimated Cost</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No pre-authorization requests found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApprovals.map((approval) => (
                    <TableRow key={approval.id}>
                      <TableCell className="font-mono text-sm">{approval.requestNumber}</TableCell>
                      <TableCell>{approval.memberName}</TableCell>
                      <TableCell>{approval.procedure}</TableCell>
                      <TableCell>{formatDate(approval.procedureDate)}</TableCell>
                      <TableCell>{formatCurrency(approval.estimatedCost)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(approval.status)}>
                          {approval.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(approval)}
                        >
                          <Eye size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ApprovalViewDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        approval={selectedApproval}
      />
    </div>
  )
}
