import { createContext, useContext, ReactNode } from 'react'
import { User, AuthState } from '@/types'
import { useKV } from '@github/spark/hooks'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasRole: (roles: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useKV<AuthState>('auth-state', {
    user: null,
    token: null,
    isAuthenticated: false,
  })

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = await window.spark.kv.get<User[]>('users') || []
    
    const user = users.find(u => u.email === email && u.active)
    
    if (user) {
      const token = `jwt-${user.id}-${Date.now()}`
      setAuthState((prev) => ({
        ...prev,
        user,
        token,
        isAuthenticated: true,
      }))
      
      await window.spark.kv.set('audit-logs', [
        ...(await window.spark.kv.get<any[]>('audit-logs') || []),
        {
          id: `audit-${Date.now()}`,
          userId: user.id,
          userName: user.name,
          action: 'LOGIN',
          module: 'AUTH',
          entityId: user.id,
          details: 'User logged in',
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1',
        }
      ])
      
      return true
    }
    
    return false
  }

  const logout = () => {
    setAuthState((prev) => ({
      ...prev,
      user: null,
      token: null,
      isAuthenticated: false,
    }))
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!authState?.user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(authState.user.role)
  }

  return (
    <AuthContext.Provider value={{ 
      user: authState?.user || null,
      token: authState?.token || null,
      isAuthenticated: authState?.isAuthenticated || false,
      login, 
      logout, 
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}