import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PlaceholderModuleProps {
  title: string
  description: string
}

export function PlaceholderModule({ title, description }: PlaceholderModuleProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Module Under Construction</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This module is currently being developed. Full CRUD functionality will be available soon.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Expected features: Create, Read, Update, Delete operations with comprehensive form validation,
            search and filtering capabilities, and role-based access control.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}