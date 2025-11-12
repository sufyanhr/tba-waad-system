const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090/api'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token')
}

async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'An error occurred' }))
    throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`)
  }

  return response
}

export const authApi = {
  async login(email: string, password: string) {
    const response = await fetchWithAuth('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  async register(data: {
    email: string
    password: string
    name: string
    role: string
  }) {
    const response = await fetchWithAuth('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getCurrentUser() {
    const response = await fetchWithAuth('/auth/me')
    return response.json()
  },
}

export const claimsApi = {
  async getAll(params?: { status?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/claims${queryString}`)
    return response.json()
  },

  async getById(id: string) {
    const response = await fetchWithAuth(`/claims/${id}`)
    return response.json()
  },

  async create(data: any) {
    const response = await fetchWithAuth('/claims', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(id: string, data: any) {
    const response = await fetchWithAuth(`/claims/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string) {
    const response = await fetchWithAuth(`/claims/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },

  async updateStatus(id: string, status: string, notes?: string) {
    const response = await fetchWithAuth(`/claims/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, notes }),
    })
    return response.json()
  },
}

export const approvalsApi = {
  async getAll(params?: { status?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/approvals${queryString}`)
    return response.json()
  },

  async getById(id: string) {
    const response = await fetchWithAuth(`/approvals/${id}`)
    return response.json()
  },

  async create(data: any) {
    const response = await fetchWithAuth('/approvals', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(id: string, data: any) {
    const response = await fetchWithAuth(`/approvals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async approve(id: string, notes?: string) {
    const response = await fetchWithAuth(`/approvals/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    })
    return response.json()
  },

  async reject(id: string, notes: string) {
    const response = await fetchWithAuth(`/approvals/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ notes }),
    })
    return response.json()
  },
}

export const membersApi = {
  async getAll(params?: { organizationId?: string; status?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/members${queryString}`)
    return response.json()
  },

  async getById(id: string) {
    const response = await fetchWithAuth(`/members/${id}`)
    return response.json()
  },

  async create(data: any) {
    const response = await fetchWithAuth('/members', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(id: string, data: any) {
    const response = await fetchWithAuth(`/members/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string) {
    const response = await fetchWithAuth(`/members/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },
}

export const providersApi = {
  async getAll(params?: { type?: string; status?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/providers${queryString}`)
    return response.json()
  },

  async getById(id: string) {
    const response = await fetchWithAuth(`/providers/${id}`)
    return response.json()
  },

  async create(data: any) {
    const response = await fetchWithAuth('/providers', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(id: string, data: any) {
    const response = await fetchWithAuth(`/providers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string) {
    const response = await fetchWithAuth(`/providers/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },
}

export const organizationsApi = {
  async getAll(params?: { status?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/organizations${queryString}`)
    return response.json()
  },

  async getById(id: string) {
    const response = await fetchWithAuth(`/organizations/${id}`)
    return response.json()
  },

  async create(data: any) {
    const response = await fetchWithAuth('/organizations', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async update(id: string, data: any) {
    const response = await fetchWithAuth(`/organizations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async delete(id: string) {
    const response = await fetchWithAuth(`/organizations/${id}`, {
      method: 'DELETE',
    })
    return response.ok
  },
}

export const financeApi = {
  async getInvoices(params?: { providerId?: string; status?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/finance/invoices${queryString}`)
    return response.json()
  },

  async getSettlements(params?: { providerId?: string; page?: number; size?: number }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/finance/settlements${queryString}`)
    return response.json()
  },

  async createInvoice(data: any) {
    const response = await fetchWithAuth('/finance/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async processPayment(invoiceId: string, data: any) {
    const response = await fetchWithAuth(`/finance/invoices/${invoiceId}/payment`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return response.json()
  },
}

export const reportsApi = {
  async generate(params: {
    type: string
    startDate: string
    endDate: string
    providerId?: string
    organizationId?: string
    status?: string
  }) {
    const response = await fetchWithAuth('/reports/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    })
    return response.json()
  },

  async export(reportId: string, format: 'PDF' | 'EXCEL') {
    const response = await fetchWithAuth(`/reports/${reportId}/export?format=${format}`)
    return response.blob()
  },
}

export const dashboardApi = {
  async getStats() {
    const response = await fetchWithAuth('/dashboard/stats')
    return response.json()
  },

  async getRecentActivity() {
    const response = await fetchWithAuth('/dashboard/activity')
    return response.json()
  },
}

export const settingsApi = {
  async getSettings() {
    const response = await fetchWithAuth('/settings')
    return response.json()
  },

  async updateSettings(data: any) {
    const response = await fetchWithAuth('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    return response.json()
  },

  async getAuditLogs(params?: { page?: number; size?: number; userId?: string; module?: string }) {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    const response = await fetchWithAuth(`/settings/audit-logs${queryString}`)
    return response.json()
  },
}

export { ApiError }
