import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Claim, ClaimStatus } from '@/types'
import { FileList } from '@/components/FileUpload'

interface ClaimViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  claim?: Claim
}

export function ClaimViewDialog({ open, onOpenChange, claim }: ClaimViewDialogProps) {
  if (!claim) return null

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
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Claim Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Claim Number</p>
              <p className="text-lg font-mono font-semibold">{claim.claimNumber}</p>
            </div>
            <Badge variant="outline" className={getStatusColor(claim.status)}>
              {claim.status.replace('_', ' ')}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Member</p>
              <p className="font-medium">{claim.memberName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Provider</p>
              <p className="font-medium">{claim.providerName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Service Date</p>
              <p>{formatDate(claim.serviceDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Submission Date</p>
              <p>{formatDate(claim.submissionDate)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Claimed Amount</p>
              <p className="text-lg font-semibold">{formatCurrency(claim.amount)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Approved Amount</p>
              <p className="text-lg font-semibold">
                {claim.approvedAmount > 0 ? formatCurrency(claim.approvedAmount) : 'Pending'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
            <p>{claim.diagnosis}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">Treatment</p>
            <p>{claim.treatment}</p>
          </div>

          {claim.reviewNotes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Review Notes</p>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{claim.reviewNotes}</p>
            </div>
          )}

          {claim.reviewedBy && claim.reviewedAt && (
            <div className="text-sm text-muted-foreground border-t pt-4">
              Reviewed by {claim.reviewedBy} on {formatDate(claim.reviewedAt)}
            </div>
          )}

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">Supporting Documents</p>
            <FileList
              category="CLAIM"
              entityId={claim.id}
              showDelete={false}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}