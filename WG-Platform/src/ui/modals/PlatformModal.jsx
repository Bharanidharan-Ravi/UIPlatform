import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';

export function PlatformModal({
  open,
  title,
  children,
  actions,
  onClose,
  maxWidth = 'sm',
  fullWidth = true,
  ...props
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      {...props}
    >
      {title ? <DialogTitle>{title}</DialogTitle> : null}
      <DialogContent>{children}</DialogContent>
      {actions ? <DialogActions>{actions}</DialogActions> : null}
    </Dialog>
  );
}
