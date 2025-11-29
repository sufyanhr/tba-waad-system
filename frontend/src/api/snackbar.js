import { useMemo, useEffect, useState } from 'react';

const endpoints = {
  key: 'snackbar'
};

const initialState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  variant: 'default',
  alert: {
    color: 'primary',
    variant: 'filled'
  },
  transition: 'Fade',
  close: false,
  actionButton: false,
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault',
  hideIconVariant: false
};

export function useGetSnackbar() {
  const [snackbar, setSnackbar] = useState(initialState);

  useEffect(() => {
    function handle(e) {
      setSnackbar(e.detail || initialState);
    }
    window.addEventListener('snackbarUpdate', handle);
    // initialize
    setSnackbar(initialState);
    return () => window.removeEventListener('snackbarUpdate', handle);
  }, []);

  const memoizedValue = useMemo(() => ({ snackbar }), [snackbar]);
  return memoizedValue;
}

export function openSnackbar(snackbar) {
  // to update local state based on key

  const { action, open, message, anchorOrigin, variant, alert, transition, close, actionButton } = snackbar;

  const payload = {
    ...initialState,
    action: action || initialState.action,
    open: open || initialState.open,
    message: message || initialState.message,
    anchorOrigin: anchorOrigin || initialState.anchorOrigin,
    variant: variant || initialState.variant,
    alert: {
      color: alert?.color || initialState.alert.color,
      variant: alert?.variant || initialState.alert.variant
    },
    transition: transition || initialState.transition,
    close: close || initialState.close,
    actionButton: actionButton || initialState.actionButton
  };
  window.dispatchEvent(new CustomEvent('snackbarUpdate', { detail: payload }));
}

export function closeSnackbar() {
  const payload = { ...initialState, open: false };
  window.dispatchEvent(new CustomEvent('snackbarUpdate', { detail: payload }));
}

export function handlerIncrease(maxStack) {
  const payload = { ...initialState, maxStack };
  window.dispatchEvent(new CustomEvent('snackbarUpdate', { detail: payload }));
}

export function handlerDense(dense) {
  const payload = { ...initialState, dense };
  window.dispatchEvent(new CustomEvent('snackbarUpdate', { detail: payload }));
}

export function handlerIconVariants(iconVariant) {
  const payload = { ...initialState, iconVariant, hideIconVariant: iconVariant === 'hide' };
  window.dispatchEvent(new CustomEvent('snackbarUpdate', { detail: payload }));
}
