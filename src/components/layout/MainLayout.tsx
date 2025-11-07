import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  SquaresFour, 
  Users, 
  Buildings, 
  UsersFour, 
  Hospital, 
  FileText, 
  CheckCircle, 
  CurrencyDollar, 
  ChartBar, 
  Gear,
  SignOut
} from '@phosphor-icons/react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { LanguageSwitcher } from './LanguageSwitcher'

interface MainLayoutProps {
  children: ReactNode
  activeModule: string
  onModuleChange: (module: string) => void
}

const modules = [
  { id: 'dashboard', labelKey: 'nav.dashboard', icon: SquaresFour, roles: ['ADMIN', 'INSURANCE', 'PROVIDER', 'EMPLOYER', 'MEMBER'] },
  { id: 'users', labelKey: 'nav.users', icon: Users, roles: ['ADMIN', 'INSURANCE'] },
  { id: 'organizations', labelKey: 'nav.organizations', icon: Buildings, roles: ['ADMIN', 'INSURANCE'] },
  { id: 'members', labelKey: 'nav.members', icon: UsersFour, roles: ['ADMIN', 'INSURANCE', 'EMPLOYER'] },
  { id: 'providers', labelKey: 'nav.providers', icon: Hospital, roles: ['ADMIN', 'INSURANCE'] },
  { id: 'claims', labelKey: 'nav.claims', icon: FileText, roles: ['ADMIN', 'INSURANCE', 'PROVIDER', 'MEMBER'] },
  { id: 'approvals', labelKey: 'nav.approvals', icon: CheckCircle, roles: ['ADMIN', 'INSURANCE', 'PROVIDER'] },
  { id: 'finance', labelKey: 'nav.finance', icon: CurrencyDollar, roles: ['ADMIN', 'INSURANCE', 'PROVIDER'] },
  { id: 'reports', labelKey: 'nav.reports', icon: ChartBar, roles: ['ADMIN', 'INSURANCE', 'EMPLOYER'] },
  { id: 'settings', labelKey: 'nav.settings', icon: Gear, roles: ['ADMIN'] },
]

export function MainLayout({ children, activeModule, onModuleChange }: MainLayoutProps) {
  const { t } = useTranslation()
  const { user, logout, hasRole } = useAuth()

  const visibleModules = modules.filter(module => 
    module.roles.some(role => hasRole(role))
  )

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Hospital size={24} weight="bold" className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg tracking-tight">TBA-WAAD</h1>
              <p className="text-xs text-muted-foreground">{t('login.subtitle')}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {visibleModules.map((module) => {
              const Icon = module.icon
              const isActive = activeModule === module.id
              
              return (
                <Button
                  key={module.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 h-10',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary'
                  )}
                  onClick={() => onModuleChange(module.id)}
                >
                  <Icon size={20} weight={isActive ? 'fill' : 'regular'} />
                  <span className="font-medium">{t(module.labelKey)}</span>
                </Button>
              )
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex items-center gap-3 px-2">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-medium">
                {user ? getInitials(user.name) : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full justify-start gap-3"
            onClick={logout}
          >
            <SignOut size={18} />
            <span>{t('nav.logout')}</span>
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="border-b border-border bg-card px-6 py-3 flex items-center justify-end">
          <LanguageSwitcher />
        </header>
        <ScrollArea className="flex-1">
          <div className="p-6">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}