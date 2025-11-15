// components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import Loader from 'components/Loader';

const ProtectedRoute = ({ children, roles = [], permissions = [] }) => {
  const { isLoggedIn, isInitialized, hasAnyRole, hasAnyPermission } = useAuth();
  const location = useLocation();

  // انتظر حتى يكتمل التهيئة
  if (!isInitialized) {
    return <Loader />;
  }

  // إذا لم يسجل دخول، اتجه إلى صفحة تسجيل الدخول
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // إذا لم يمرر أدوار أو صلاحيات، اسمح بالوصول
  if (roles.length === 0 && permissions.length === 0) {
    return children;
  }

  // تحقق من الأدوار والصلاحيات
  const hasRequiredRole = roles.length > 0 ? hasAnyRole(roles) : false;
  const hasRequiredPermission = permissions.length > 0 ? hasAnyPermission(permissions) : false;

  // Allow access if user has any required role OR any required permission
  if (hasRequiredRole || hasRequiredPermission) {
    return children;
  }

  // إذا لم يملك الصلاحيات المطلوبة، اتجه إلى صفحة الرفض
  return <Navigate to="/maintenance/403" replace />;
};

export default ProtectedRoute;