export function isPlatformDebugEnabled() {
  return typeof window !== 'undefined' && window.WG_DEBUG === true;
}
