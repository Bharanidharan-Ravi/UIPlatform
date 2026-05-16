import { Card, CardContent, CardHeader } from '@mui/material';

export function PlatformCard({ title, subheader, children, actions, ...props }) {
  return (
    <Card variant="outlined" {...props}>
      {title || subheader || actions ? (
        <CardHeader title={title} subheader={subheader} action={actions} />
      ) : null}
      <CardContent>{children}</CardContent>
    </Card>
  );
}
