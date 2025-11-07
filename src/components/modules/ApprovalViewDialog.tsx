import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Approval, ApprovalStatus } from '@/types'
import { FileUpload, FileList } from '@/components/FileUpload'

interface ApprovalViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  approval?: Approval
}

export function ApprovalViewDialog({ open, onOpenChange, approval }: ApprovalViewDialogProps) {
  if (!approval) return null

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
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pre-Authorization Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Request Number</p>
              <p className="text-lg font-mono font-semibold">{approval.requestNumber}</p>
            </div>
            <Badge variant="outline" className={getStatusColor(approval.status)}>
              {approval.status}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Member</p>
              <p className="font-medium">{approval.memberName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Provider</p>
              <p className="font-medium">{approval.providerName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Request Date</p>
              <p>{formatDate(approval.requestDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Scheduled Procedure Date</p>
              <p>{formatDate(approval.procedureDate)}</p>
            </div>
          </div>

          <Card className="p-4 bg-muted/50">
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Procedure</p>
                <p className="font-medium">{approval.procedure}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Diagnosis</p>
                <p>{approval.diagnosis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Estimated Cost</p>
                <p className="text-lg font-semibold">{formatCurrency(approval.estimatedCost)}</p>
              </div>
            </div>
          </Card>

          {approval.notes && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">{approval.notes}</p>
            </div>
          )}

          {approval.approvedBy && approval.approvedAt && (
            <div className="text-sm text-muted-foreground border-t pt-4">
              {approval.status === 'APPROVED' ? 'Approved' : 'Rejected'} by {approval.approvedBy} on{' '}
              {formatDate(approval.approvedAt)}
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-3">Upload Supporting Documents</h4>
              <FileUpload
                category="APPROVAL"
                entityId={approval.id}
                entityReference={approval.requestNumber}
                maxSizeMB={10}
              />
            </div>

            <div>
              <h4 className="text-sm font-medium mb-3">Uploaded Documents</h4>
              <FileList
                category="APPROVAL"
                entityId={approval.id}
                showDelete={approval.status === 'PENDING'}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
