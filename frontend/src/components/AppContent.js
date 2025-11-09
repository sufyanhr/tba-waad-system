import React, { Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import routes from '../routes'
import { CContainer, CSpinner } from '@coreui/react'

const AppContent = () => {
  // ✅ دالة ذكية لتحديد طريقة عرض العنصر
  const renderElement = (element) => {
    if (!element) return <Navigate to="/login" />
    if (React.isValidElement(element)) return element // JSX مباشر
    if (typeof element === 'function') return element() // دالة ترجع JSX
    return React.createElement(element) // مكوّن عادي
  }

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            if (!route.element) return null
            return (
              <Route
                key={route.path || idx}
                path={route.path}
                exact={route.exact}
                element={renderElement(route.element)}
              />
            )
          })}
          {/* ✅ إعادة توجيه افتراضية في حال لم يوجد مسار مطابق */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
