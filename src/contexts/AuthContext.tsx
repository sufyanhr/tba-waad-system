import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { User } from '@/types'
import { authApi } from '@/services/api'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasRole: (roles: string | string[]) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token')
    if (storedToken) {
      setToken(storedToken)
      loadCurrentUser(storedToken)
    } else {
      setLoading(false)
    }
  }, [])

  const loadCurrentUser = async (authToken: string) => {
    try {
      const userData = await authApi.getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error('Failed to load user:', error)
      localStorage.removeItem('auth_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login(email, password)
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token)
        setToken(response.token)
        setUser(response.user)
        toast.success('Successfully logged in')
        return true
      }
      
      toast.error('Invalid credentials')
      return false
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Login failed')
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setToken(null)
    setUser(null)
    toast.info('Logged out successfully')
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.role)
  }

  return (
    <AuthContext.Provider value={{ 
      user,
      token,
      isAuthenticated: !!token && !!user,
      loading,
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