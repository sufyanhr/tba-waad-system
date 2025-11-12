import api from './axios'

export const uploadClaimAttachment = async (claimId, file, uploadedBy, token) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('uploadedBy', uploadedBy)

  const response = await api.post(`/api/claims/attachments/${claimId}/upload`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  })
  return response.data
}

export const getClaimAttachments = async (claimId, token) => {
  const response = await api.get(`/api/claims/attachments/${claimId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}
