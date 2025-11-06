import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginPage } from '@/components/auth/LoginPage'
import { MainLayout } from '@/components/layout/MainLayout'
import { Dashboard } from '@/components/modules/Dashboard'
import { Claims } from '@/components/modules/Claims'
import { PlaceholderModule } from '@/components/modules/PlaceholderModule'

function AppContent() {
  const { isAuthenticated, login } = useAuth()
  const [activeModule, setActiveModule] = useState('dashboard')

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
        return <PlaceholderModule title="Members" description="Manage insured members" />
      case 'providers':
        return <PlaceholderModule title="Providers" description="Manage healthcare providers" />
      case 'claims':
        return <Claims />
      case 'approvals':
        return <PlaceholderModule title="Approvals" description="Pre-authorization management" />
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