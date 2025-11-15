import { useState, useEffect } from 'react';
import { Snackbar, Alert, AlertTitle, Slide, Stack } from '@mui/material';

// ==============================|| RBAC NOTIFICATIONS ||============================== //

// Hook لإدارة الإشعارات
export const useRbacNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const showSuccess = (message, title = "تم بنجاح") => {
    addNotification({
      type: 'success',
      title,
      message,
      duration: 4000
    });
  };

  const showError = (message, title = "خطأ") => {
    addNotification({
      type: 'error',
      title,
      message,
      duration: 6000
    });
  };

  const showWarning = (message, title = "تحذير") => {
    addNotification({
      type: 'warning',
      title,
      message,
      duration: 5000
    });
  };

  const showInfo = (message, title = "معلومات") => {
    addNotification({
      type: 'info',
      title,
      message,
      duration: 4000
    });
  };

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return {
    notifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeNotification
  };
};

// مكون الإشعارات
export const RbacNotificationProvider = ({ children, notifications, onRemove }) => {
  return (
    <>
      {children}
      <Stack spacing={1} sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999, maxWidth: 400 }}>
        {notifications.map((notification) => (
          <RbacNotification
            key={notification.id}
            notification={notification}
            onClose={() => onRemove(notification.id)}
          />
        ))}
      </Stack>
    </>
  );
};

// مكون الإشعار المفرد
const RbacNotification = ({ notification, onClose }) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (notification.duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification.duration]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const TransitionComponent = (props) => <Slide {...props} direction="left" />;

  return (
    <Snackbar
      open={open}
      TransitionComponent={TransitionComponent}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        severity={notification.type}
        onClose={handleClose}
        variant="filled"
        sx={{ minWidth: 300 }}
      >
        {notification.title && (
          <AlertTitle>{notification.title}</AlertTitle>
        )}
        {notification.message}
      </Alert>
    </Snackbar>
  );
};

// رسائل إشعارات محددة لـ RBAC
export const RBAC_MESSAGES = {
  // Roles
  ROLE_CREATED: 'تم إنشاء الدور بنجاح',
  ROLE_UPDATED: 'تم تحديث الدور بنجاح',
  ROLE_DELETED: 'تم حذف الدور بنجاح',
  ROLE_CREATE_ERROR: 'فشل في إنشاء الدور',
  ROLE_UPDATE_ERROR: 'فشل في تحديث الدور',
  ROLE_DELETE_ERROR: 'فشل في حذف الدور',

  // Permissions
  PERMISSION_CREATED: 'تم إنشاء الصلاحية بنجاح',
  PERMISSION_UPDATED: 'تم تحديث الصلاحية بنجاح',
  PERMISSION_DELETED: 'تم حذف الصلاحية بنجاح',
  PERMISSION_CREATE_ERROR: 'فشل في إنشاء الصلاحية',
  PERMISSION_UPDATE_ERROR: 'فشل في تحديث الصلاحية',
  PERMISSION_DELETE_ERROR: 'فشل في حذف الصلاحية',

  // Assignments
  ROLES_ASSIGNED: 'تم تعيين الأدوار بنجاح',
  PERMISSIONS_ASSIGNED: 'تم تعيين الصلاحيات بنجاح',
  ROLES_ASSIGN_ERROR: 'فشل في تعيين الأدوار',
  PERMISSIONS_ASSIGN_ERROR: 'فشل في تعيين الصلاحيات',

  // General
  LOAD_ERROR: 'فشل في تحميل البيانات',
  UNAUTHORIZED: 'ليس لديك صلاحية للقيام بهذا الإجراء',
  NETWORK_ERROR: 'خطأ في الاتصال بالخادم',
  VALIDATION_ERROR: 'يرجى التحقق من البيانات المدخلة'
};

export default {
  useRbacNotifications,
  RbacNotificationProvider,
  RBAC_MESSAGES
};