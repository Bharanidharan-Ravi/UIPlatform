export { PlatformRouter } from './PlatformRouter.jsx';
export {
  RouteRenderer,
  validateRouteConfig,
  isRenderableRoute
} from './RouteRenderer.jsx';
export { ProtectedRoute } from './ProtectedRoute.jsx';
export { RouteLayoutRenderer } from './RouteLayoutRenderer.jsx';
export {
  buildNavigationPath,
  goBackSafe,
  goToRouteKey,
  navigateWithParams
} from './SmartNavigate.jsx';
export { buildBreadcrumbs } from './BreadcrumbBuilder.js';
export { canAccessRoute, validateRoutePolicy } from './policy/index.js';
export {
  useBreadcrumbs,
  useRouteAccess,
  useSmartNavigation
} from './hooks/index.js';
export { AccessContext, useAccess } from './AccessContext.jsx';

