export type UserRole = 'ADMIN' | 'INSURANCE' | 'PROVIDER' | 'EMPLOYER' | 'MEMBER'

export type ClaimStatus = 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAID' | 'CLOSED'

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED'

export type ProviderType = 'HOSPITAL' | 'CLINIC' | 'PHARMACY' | 'LAB' | 'SPECIALIST'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId?: string
  providerId?: string
  createdAt: string
  active: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export interface Organization {
  id: string
  name: string
  type: string
  contactPerson: string
  email: string
  phone: string
  address: string
  memberCount: number
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
}

export interface Member {
  id: string
  organizationId: string
  organizationName: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  employeeId: string
  coverageStartDate: string
  coverageEndDate: string
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  dependents: number
  createdAt: string
}

export interface Provider {
  id: string
  name: string
  type: ProviderType
  specialty: string
  licenseNumber: string
  email: string
  phone: string
  address: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  claimsProcessed: number
  createdAt: string
}

export interface Claim {
  id: string
  claimNumber: string
  memberId: string
  memberName: string
  providerId: string
  providerName: string
  serviceDate: string
  submissionDate: string
  amount: number
  approvedAmount: number
  status: ClaimStatus
  diagnosis: string
  treatment: string
  documents: string[]
  reviewNotes: string
  reviewedBy?: string
  reviewedAt?: string
}

export interface Approval {
  id: string
  requestNumber: string
  memberId: string
  memberName: string
  providerId: string
  providerName: string
  requestDate: string
  procedureDate: string
  procedure: string
  diagnosis: string
  estimatedCost: number
  status: ApprovalStatus
  approvedBy?: string
  approvedAt?: string
  notes: string
}

export interface Invoice {
  id: string
  invoiceNumber: string
  providerId: string
  providerName: string
  issueDate: string
  dueDate: string
  amount: number
  paidAmount: number
  status: InvoiceStatus
  claimIds: string[]
  paymentDate?: string
  notes: string
}

export interface Settlement {
  id: string
  settlementNumber: string
  providerId: string
  providerName: string
  periodStart: string
  periodEnd: string
  totalClaims: number
  totalAmount: number
  processedDate: string
  status: 'PENDING' | 'PROCESSED' | 'COMPLETED'
}

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  module: string
  entityId: string
  details: string
  timestamp: string
  ipAddress: string
}

export interface DashboardStats {
  totalClaims: number
  pendingClaims: number
  approvedClaims: number
  totalAmount: number
  totalMembers: number
  activeProviders: number
  pendingApprovals: number
  overdueInvoices: number
}

export interface ReportParams {
  type: 'CLAIMS' | 'FINANCIAL' | 'UTILIZATION' | 'PROVIDER_PERFORMANCE'
  startDate: string
  endDate: string
  providerId?: string
  organizationId?: string
  status?: string
}

export interface SystemSettings {
  claimApprovalThreshold: number
  autoApprovalEnabled: boolean
  paymentTermsDays: number
  documentRetentionDays: number
  notificationEmail: string
  maintenanceMode: boolean
}