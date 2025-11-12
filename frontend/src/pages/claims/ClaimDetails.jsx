import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import api from '../../api/axios'
import ClaimAttachments from './ClaimAttachments'

const ClaimDetails = ({ claimId, token, uploadedBy }) => {
  const [claim, setClaim] = useState(null)
  const [loading, setLoading] = useState(true)

  // 🔹 تحميل بيانات المطالبة من الـ API
  useEffect(() => {
    const fetchClaim = async () => {
      try {
        const response = await api.get(`/api/claims/${claimId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setClaim(response.data)
      } catch (error) {
        console.error('Error fetching claim:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchClaim()
  }, [claimId, token])

  if (loading) return <p>Loading claim details...</p>
  if (!claim) return <p>Claim not found.</p>

  return (
    <div className="claim-details" style={{ padding: '20px' }}>
      <h2>Claim Details</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>Basic Information</h3>
        <p>
          <strong>ID:</strong> {claim.id}
        </p>
        <p>
          <strong>Diagnosis:</strong> {claim.diagnosis}
        </p>
        <p>
          <strong>Treatment:</strong> {claim.treatmentDescription}
        </p>
        <p>
          <strong>Amount Claimed:</strong> {claim.claimedAmount} LYD
        </p>
        <p>
          <strong>Status:</strong> {claim.status}
        </p>
        <p>
          <strong>Submission Date:</strong> {claim.submissionDate}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Member Info</h3>
        {claim.member ? (
          <>
            <p>
              <strong>Name:</strong> {claim.member.fullName}
            </p>
            <p>
              <strong>Employee Code:</strong> {claim.member.employeeCode}
            </p>
            <p>
              <strong>Phone:</strong> {claim.member.phone}
            </p>
            <p>
              <strong>Organization:</strong> {claim.member.organization?.name}
            </p>
          </>
        ) : (
          <p>No member linked.</p>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h3>Provider Info</h3>
        {claim.provider ? (
          <>
            <p>
              <strong>Name:</strong> {claim.provider.name}
            </p>
            <p>
              <strong>Contact:</strong> {claim.provider.contactPerson}
            </p>
            <p>
              <strong>Phone:</strong> {claim.provider.phone}
            </p>
          </>
        ) : (
          <p>No provider linked.</p>
        )}
      </div>

      <ClaimAttachments claimId={claim.id} token={token} uploadedBy={uploadedBy} />
    </div>
  )
}

ClaimDetails.propTypes = {
  claimId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  token: PropTypes.string,
  uploadedBy: PropTypes.string,
}

export default ClaimDetails
