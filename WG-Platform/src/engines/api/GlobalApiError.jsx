import { Alert, Snackbar } from '@mui/material';
import { useGlobalError } from './useGlobalError.js';

export function GlobalApiError({
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  severity = 'error',
  resolveMessage,
  fallbackMessage = 'Request failed.',
  ...props
}) {
  const { errors, dismissError } = useGlobalError();
  const currentError = errors[0];
  const moreCount = Math.max(0, errors.length - 1);

  if (!currentError) {
    return null;
  }

  const handleClose = () => {
    dismissError(currentError.id);
  };
  const message =
    typeof resolveMessage === 'function'
      ? resolveMessage(currentError)
      : currentError.message || fallbackMessage;

  return (
    <Snackbar
      open
      anchorOrigin={anchorOrigin}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      {...props}
    >
      <Alert onClose={handleClose} severity={severity} variant="filled">
        {message}
        {moreCount > 0 ? ` (${moreCount} more)` : ''}
      </Alert>
    </Snackbar>
  );
}
