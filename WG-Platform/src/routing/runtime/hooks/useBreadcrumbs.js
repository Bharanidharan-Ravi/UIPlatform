import { useMemo, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import {
  getRouteSnapshot,
  subscribeRoutes
} from '../../registry/routeRegistry.js';
import { buildBreadcrumbs } from '../BreadcrumbBuilder.js';

function useRegisteredRoutes() {
  return useSyncExternalStore(subscribeRoutes, getRouteSnapshot, getRouteSnapshot);
}

export function useBreadcrumbs({
  routes,
  pathname,
  includeHidden = false
} = {}) {
  const location = useLocation();
  const registeredRoutes = useRegisteredRoutes();
  const resolvedRoutes = routes || registeredRoutes;
  const resolvedPathname = pathname || location.pathname;

  return useMemo(
    () =>
      buildBreadcrumbs({
        routes: resolvedRoutes,
        pathname: resolvedPathname,
        includeHidden
      }),
    [includeHidden, resolvedPathname, resolvedRoutes]
  );
}
