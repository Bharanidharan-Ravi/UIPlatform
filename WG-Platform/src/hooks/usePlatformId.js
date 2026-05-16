import { useId } from 'react';

export function usePlatformId(prefix = 'wg') {
  const id = useId();
  return `${prefix}-${id.replace(/:/g, '')}`;
}
