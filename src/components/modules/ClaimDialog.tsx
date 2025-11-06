import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Claim, ClaimStatus, Member, Provider } from '@/types'
import { useAuth } from '@/contexts/AuthContext'

interface ClaimDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  claim?: Claim
  onSave: (claim: Claim) => void
}

export function ClaimDialog({ open, onOpenChange, claim, onSave }: ClaimDialogProps) {
  const { user } = useAuth()
  const [members, setMembers] = useState<Member[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [formData, setFormData] = useState<Partial<Claim>>({
    memberId: '',
    providerId: '',
    serviceDate: '',
    amount: 0,
    diagnosis: '',
    treatment: '',
    status: 'PENDING',
  })

  useEffect(() => {
    if (open) {
      loadData()
      if (claim) {
        setFormData(claim)
      } else {
        setFormData({
          memberId: '',
          providerId: user?.providerId || '',
          serviceDate: new Date().toISOString().split('T')[0],
          amount: 0,
          diagnosis: '',
          treatment: '',
          status: 'PENDING',
        })
      }
    }
  }, [open, claim, user])

  const loadData = async () => {
    const membersData = await window.spark.kv.get<Member[]>('members') || []
    const providersData = await window.spark.kv.get<Provider[]>('providers') || []
    setMembers(membersData.filter(m => m.status === 'ACTIVE'))
    setProviders(providersData.filter(p => p.status === 'ACTIVE'))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const member = members.find(m => m.id === formData.memberId)
    const provider = providers.find(p => p.id === formData.providerId)
    
    const claimData: Claim = {
      id: claim?.id || `claim-${Date.now()}`,
      claimNumber: claim?.claimNumber || `CLM-${Date.now().toString().slice(-8)}`,
      memberId: formData.memberId!,
      memberName: member ? `${member.firstName} ${member.lastName}` : claim?.memberName || '',
      providerId: formData.providerId!,
      providerName: provider?.name || claim?.providerName || '',
      serviceDate: formData.serviceDate!,
      submissionDate: claim?.submissionDate || new Date().toISOString(),
      amount: formData.amount!,
      approvedAmount: formData.approvedAmount || 0,
      status: formData.status as ClaimStatus,
      diagnosis: formData.diagnosis!,
      treatment: formData.treatment!,
      documents: formData.documents || [],
      reviewNotes: formData.reviewNotes || '',
      reviewedBy: formData.reviewedBy,
      reviewedAt: formData.reviewedAt,
    }
    
    onSave(claimData)
  }

  const isReview = !!claim

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isReview ? 'Review Claim' : 'New Claim'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="member">Member *</Label>
              <Select
                value={formData.memberId}
                onValueChange={(value) => setFormData({ ...formData, memberId: value })}
                disabled={isReview}
              >
                <SelectTrigger id="member">
                  <SelectValue placeholder="Select member" />
                </SelectTrigger>
                <SelectContent>
                  {members.map((member) => (
                    <SelectItem key={member.id} value={member.id}>
                      {member.firstName} {member.lastName} ({member.employeeId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="provider">Provider *</Label>
              <Select
                value={formData.providerId}
                onValueChange={(value) => setFormData({ ...formData, providerId: value })}
                disabled={isReview}
              >
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((provider) => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name} ({provider.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="serviceDate">Service Date *</Label>
              <Input
                id="serviceDate"
                type="date"
                value={formData.serviceDate}
                onChange={(e) => setFormData({ ...formData, serviceDate: e.target.value })}
                disabled={isReview}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                disabled={isReview}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosis">Diagnosis *</Label>
            <Input
              id="diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
              disabled={isReview}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatment">Treatment *</Label>
            <Textarea
              id="treatment"
              value={formData.treatment}
              onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
              disabled={isReview}
              rows={3}
              required
            />
          </div>

          {isReview && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value as ClaimStatus })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_REVIEW">In Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="CLOSED">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="approvedAmount">Approved Amount</Label>
                  <Input
                    id="approvedAmount"
                    type="number"
                    step="0.01"
                    value={formData.approvedAmount || ''}
                    onChange={(e) => setFormData({ ...formData, approvedAmount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewNotes">Review Notes</Label>
                <Textarea
                  id="reviewNotes"
                  value={formData.reviewNotes}
                  onChange={(e) => setFormData({ ...formData, reviewNotes: e.target.value })}
                  rows={3}
                />
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {isReview ? 'Update Claim' : 'Submit Claim'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}