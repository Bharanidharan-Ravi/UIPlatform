import React, { useEffect, useMemo, useSyncExternalStore } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import {
  getRouteSnapshot,
  subscribeRoutes
} from '../registry/routeRegistry.js';
import {
  RouteRenderer,
  isRenderableRoute,
  validateRouteConfig
} from './RouteRenderer.jsx';

function useRegisteredRoutes() {
  return useSyncExternalStore(subscribeRoutes, getRouteSnapshot, getRouteSnapshot);
}

function isSamePath(currentPath, nextPath) {
  const current = currentPath || '/';
  const next = String(nextPath || '/').split('?')[0].split('#')[0] || '/';
  return current === next;
}

function NotFoundRoute({ fallbackPath, notFoundElement }) {
  const location = useLocation();

  if (notFoundElement) {
    return notFoundElement;
  }

  if (!fallbackPath || isSamePath(location.pathname, fallbackPath)) {
    return null;
  }

  return <Navigate to={fallbackPath} replace />;
}

export function PlatformRouter({
  routes,
  access,
  layouts,
  defaultLayout,
  fallbackPath = '/',
  notFoundElement = null,
  unauthorizedElement = null,
  onInvalidRoute
}) {
  const registeredRoutes = useRegisteredRoutes();
  const sourceRoutes = routes || registeredRoutes;
  const routeEntries = useMemo(() => {
    return (Array.isArray(sourceRoutes) ? sourceRoutes : []).map((route) => {
      const validation = validateRouteConfig(route);

      return {
        route,
        validation,
        renderable: validation.valid && isRenderableRoute(route)
      };
    });
  }, [sourceRoutes]);
  const invalidRouteEntries = useMemo(
    () => routeEntries.filter((entry) => !entry.validation.valid),
    [routeEntries]
  );
  const validRoutes = useMemo(
    () =>
      routeEntries
        .filter((entry) => entry.renderable)
        .map((entry) => entry.route),
    [routeEntries]
  );

  useEffect(() => {
    if (typeof onInvalidRoute !== 'function') {
      return;
    }

    invalidRouteEntries.forEach((entry) => {
      onInvalidRoute(entry.route, entry.validation);
    });
  }, [invalidRouteEntries, onInvalidRoute]);

  return (
    <Routes>
      {validRoutes.map((route) => {
        const routeElement = RouteRenderer({
          route,
          access,
          layouts,
          defaultLayout,
          fallbackPath,
          unauthorizedElement
        });

        return routeElement
          ? React.cloneElement(routeElement, { key: route.key || route.path })
          : null;
      })}
      <Route
        path="*"
        element={
          <NotFoundRoute
            fallbackPath={fallbackPath}
            notFoundElement={notFoundElement}
          />
        }
      />
    </Routes>
  );
}
