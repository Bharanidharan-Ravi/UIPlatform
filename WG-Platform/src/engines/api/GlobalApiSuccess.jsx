import { Alert, Snackbar } from '@mui/material';
import { useGlobalSuccess } from './useGlobalSuccess.js';

export function GlobalApiSuccess({
  autoHideDuration = 3000,
  anchorOrigin = { vertical: 'top', horizontal: 'right' },
  severity = 'success',
  resolveMessage,
  fallbackMessage = 'Request completed successfully.',
  ...props
}) {
  const { successes, dismissSuccess } = useGlobalSuccess();
  const currentSuccess = successes[0];
  const moreCount = Math.max(0, successes.length - 1);

  if (!currentSuccess) {
    return null;
  }

  const handleClose = () => {
    dismissSuccess(currentSuccess.id);
  };

  const message =
    typeof resolveMessage === 'function'
      ? resolveMessage(currentSuccess)
      : currentSuccess.message || fallbackMessage;

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
