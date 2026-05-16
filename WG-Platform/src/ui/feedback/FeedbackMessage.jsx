import { Alert } from '@mui/material';

export function FeedbackMessage({ severity = 'info', children, ...props }) {
  return (
    <Alert severity={severity} {...props}>
      {children}
    </Alert>
  );
}
