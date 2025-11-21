// ==============================|| SNACKBAR API ||============================== //

export function openSnackbar(options) {
  window.dispatchEvent(
    new CustomEvent('showSnackbar', {
      detail: {
        message: options.message,
        severity: options.severity || 'info'
      }
    })
  );
}
