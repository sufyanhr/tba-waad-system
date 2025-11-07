import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Member } from '@/types'
import { FileUpload, FileList } from '@/components/FileUpload'
import { User, Building, Calendar, Users } from '@phosphor-icons/react'

interface MemberViewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: Member
}

export function MemberViewDialog({ open, onOpenChange, member }: MemberViewDialogProps) {
  if (!member) return null

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      INACTIVE: 'bg-gray-100 text-gray-800 border-gray-200',
      SUSPENDED: 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[status as keyof typeof colors]
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Member Profile</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="coverage">Coverage</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-semibold">
                  {member.firstName} {member.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">ID: {member.employeeId}</p>
              </div>
              <Badge variant="outline" className={getStatusColor(member.status)}>
                {member.status}
              </Badge>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <User size={20} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Contact Information</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Email:</span> {member.email}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span> {member.phone}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Date of Birth:</span> {formatDate(member.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Building size={20} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Organization</p>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium">{member.organizationName}</p>
                      <p className="text-sm">
                        <span className="font-medium">Employee ID:</span> {member.employeeId}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="coverage" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-6">
              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Calendar size={20} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Coverage Period</p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Start Date:</span>{' '}
                        {formatDate(member.coverageStartDate)}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">End Date:</span>{' '}
                        {formatDate(member.coverageEndDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-start gap-3">
                  <Users size={20} className="text-primary mt-1" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Dependents</p>
                    <p className="text-2xl font-bold">{member.dependents}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {member.dependents === 0 ? 'No dependents' : 'Covered dependents'}
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <p className="text-sm font-medium mb-2">Coverage Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-2 flex-1 rounded-full ${
                    member.status === 'ACTIVE'
                      ? 'bg-green-500'
                      : member.status === 'SUSPENDED'
                      ? 'bg-red-500'
                      : 'bg-gray-300'
                  }`}
                />
                <span className="text-sm font-medium">{member.status}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Member since {formatDate(member.createdAt)}
              </p>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-3">Upload Member Documents</h4>
                <FileUpload
                  category="MEMBER"
                  entityId={member.id}
                  entityReference={`${member.firstName} ${member.lastName} (${member.employeeId})`}
                  maxSizeMB={10}
                />
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Uploaded Documents</h4>
                <FileList category="MEMBER" entityId={member.id} showDelete={true} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
