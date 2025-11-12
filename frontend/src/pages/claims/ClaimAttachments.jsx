import React, { useState, useEffect, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { uploadClaimAttachment, getClaimAttachments } from '../../api/claimAttachments'

const ClaimAttachments = ({ claimId, token, uploadedBy }) => {
  const [file, setFile] = useState(null)
  const [attachments, setAttachments] = useState([])
  const inputRef = useRef(null)

  // Fetch attachments; ensure any setState runs asynchronously to satisfy ESLint
  const fetchAttachments = useCallback(async () => {
    try {
      // fetch attachments from API

      const data = await getClaimAttachments(claimId, token)
      setAttachments(data || [])
    } catch (err) {
      console.error('Error fetching attachments:', err)
      setAttachments([])
    }
  }, [claimId, token])

  useEffect(() => {
    if (!claimId) {
      // clear attachments asynchronously when there's no claimId
      Promise.resolve().then(() => setAttachments([]))
      return
    }

    let mounted = true
    ;(async () => {
      try {
        const data = await getClaimAttachments(claimId, token)
        if (mounted) setAttachments(data || [])
      } catch (err) {
        console.error('Error fetching attachments:', err)
        if (mounted) setAttachments([])
      }
    })()

    return () => {
      mounted = false
    }
  }, [claimId, token])

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first!')
    if (!claimId) return alert('Claim ID is missing')
    try {
      await uploadClaimAttachment(claimId, file, uploadedBy, token)
      alert('File uploaded successfully!')
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      // re-fetch the attachments list
      await fetchAttachments()
    } catch (err) {
      console.error('Upload error:', err)
      alert('Failed to upload file')
    }
  }

  return (
    <div className="claim-attachments">
      <h3>Claim Attachments</h3>
      <input ref={inputRef} type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>

      <ul>
        {attachments.map((att) => (
          <li key={att.id}>
            <a href={`${api.defaults.baseURL}/${att.fileUrl}`} target="_blank" rel="noreferrer">
              {att.fileName}
            </a>{' '}
            — Uploaded by: {att.uploadedBy} on {att.uploadedAt}
          </li>
        ))}
      </ul>
    </div>
  )
}

ClaimAttachments.propTypes = {
  // رقم المطالبة يمكن أن يكون رقمًا أو نصًا (حسب الـ API)
  claimId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  // التوكن ضروري للمصادقة
  token: PropTypes.string.isRequired,

  // الشخص الذي رفع الملف (اختياري)
  uploadedBy: PropTypes.string,
}

export default ClaimAttachments
