import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/components/auth/LoginPage'
import { MainLayout } from '@/components/layout/MainLayout'
import { Dashboard } from '@/components/modules/Dashboard'
import { Claims } from '@/components/modules/Claims'
import { Members } from '@/components/modules/Members'
import { Approvals } from '@/components/modules/Approvals'
import { PlaceholderModule } from '@/components/modules/PlaceholderModule'

function AppContent() {
  const { isAuthenticated, loading, login } = useAuth()
  const [activeModule, setActiveModule] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />
      case 'users':
        return <PlaceholderModule title="Users" description="Manage system users and roles" />
      case 'organizations':
        return <PlaceholderModule title="Organizations" description="Manage employer organizations" />
      case 'members':
        return <Members />
      case 'providers':
        return <PlaceholderModule title="Providers" description="Manage healthcare providers" />
      case 'claims':
        return <Claims />
      case 'approvals':
        return <Approvals />
      case 'finance':
        return <PlaceholderModule title="Finance" description="Invoices and settlements" />
      case 'reports':
        return <PlaceholderModule title="Reports" description="Analytics and reporting" />
      case 'settings':
        return <PlaceholderModule title="Settings" description="System configuration and audit logs" />
      default:
        return <Dashboard />
    }
  }

  return (
    <MainLayout activeModule={activeModule} onModuleChange={setActiveModule}>
      {renderModule()}
    </MainLayout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}

export default App