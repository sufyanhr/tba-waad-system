import { use } from 'react';

// auth provider
import AuthContext from 'contexts/JWTContext';
// import AuthContext from 'contexts/FirebaseContext';
// import AuthContext from 'contexts/Auth0Context';
// import AuthContext from 'contexts/AWSCognitoContext';
// import AuthContext from 'contexts/SupabaseContext';

// ==============================|| AUTH HOOKS ||============================== //

export default function useAuth() {
  const context = use(AuthContext);

  if (!context) throw new Error('context must be use inside provider');

  // Add hasPermission function
  const hasPermission = (permission) => {
    if (!context.user) return false;
    
    // Check if user has the required permission
    const userPermissions = context.user.permissions || [];
    return userPermissions.includes(permission);
  };

  // Add hasRole function
  const hasRole = (role) => {
    if (!context.user) return false;
    
    // Check if user has the required role
    const userRoles = context.user.roles || [];
    return userRoles.includes(role);
  };

  // Add hasAnyPermission function
  const hasAnyPermission = (permissions) => {
    if (!context.user) return false;
    
    const userPermissions = context.user.permissions || [];
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Add hasAllPermissions function
  const hasAllPermissions = (permissions) => {
    if (!context.user) return false;
    
    const userPermissions = context.user.permissions || [];
    return permissions.every(permission => userPermissions.includes(permission));
  };

  return {
    ...context,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions
  };
}
