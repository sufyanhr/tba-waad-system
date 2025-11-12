import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardTitle,
  CRow,
  CCol,
  CSpinner,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'
import api from '../../api/axios'

const Dashboard = () => {
  const [stats, setStats] = useState(null)
  const [recentClaims, setRecentClaims] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, companiesRes, policiesRes, claimsRes, recentClaimsRes] = await Promise.all(
          [
            api.get('/users/count'),
            api.get('/companies/count'),
            api.get('/policies/count'),
            api.get('/claims/count'),
            api.get('/claims/recent'),
          ],
        )

        setStats({
          users: usersRes.data,
          companies: companiesRes.data,
          policies: policiesRes.data,
          claims: claimsRes.data,
        })

        setRecentClaims(recentClaimsRes.data)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="text-center p-5">
        <CSpinner color="primary" /> <br />
        Loading dashboard...
      </div>
    )
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>
      <CRow>
        <CCol sm={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <CCardTitle>Users</CCardTitle>
              <h3>{stats?.users ?? 0}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <CCardTitle>Companies</CCardTitle>
              <h3>{stats?.companies ?? 0}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <CCardTitle>Policies</CCardTitle>
              <h3>{stats?.policies ?? 0}</h3>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm={3}>
          <CCard className="mb-3 shadow-sm">
            <CCardBody>
              <CCardTitle>Claims</CCardTitle>
              <h3>{stats?.claims ?? 0}</h3>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <h4 className="mt-5 mb-3">Recent Claims</h4>
      <CTable striped hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell scope="col">#</CTableHeaderCell>
            <CTableHeaderCell scope="col">Member</CTableHeaderCell>
            <CTableHeaderCell scope="col">Company</CTableHeaderCell>
            <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Date</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {recentClaims.length > 0 ? (
            recentClaims.map((c, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{index + 1}</CTableDataCell>
                <CTableDataCell>{c.memberName}</CTableDataCell>
                <CTableDataCell>{c.companyName}</CTableDataCell>
                <CTableDataCell>{c.amount}</CTableDataCell>
                <CTableDataCell>{c.status}</CTableDataCell>
                <CTableDataCell>{new Date(c.date).toLocaleDateString()}</CTableDataCell>
              </CTableRow>
            ))
          ) : (
            <CTableRow>
              <CTableDataCell colSpan="6" className="text-center text-muted">
                No recent claims found
              </CTableDataCell>
            </CTableRow>
          )}
        </CTableBody>
      </CTable>
    </div>
  )
}

export default Dashboard
