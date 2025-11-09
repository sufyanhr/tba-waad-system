import React from 'react'
import { Navigate } from 'react-router-dom'

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  // إذا لم يوجد توكن يرجعك إلى صفحة تسجيل الدخول
  return token ? children : <Navigate to="/login" replace />
}
