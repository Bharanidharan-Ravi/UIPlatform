import { useMemo } from 'react';
import { getRoute } from '../../registry/routeRegistry.js';
import {
  canAccessRoute,
  evaluateRouteAccess,
  validateRoutePolicy
} from '../policy/routePolicy.js';

function resolveRoute(routeOrKey) {
  if (typeof routeOrKey === 'string') {
    return getRoute(routeOrKey);
  }

  return routeOrKey;
}

export function useRouteAccess(routeOrKey, access) {
  return useMemo(() => {
    const route = resolveRoute(routeOrKey);
    const result = evaluateRouteAccess(route, access);

    return {
      route,
      canAccess: canAccessRoute(route, access),
      allowed: result.allowed,
      reason: result.reason,
      validation: validateRoutePolicy(route),
      missingPermissions: result.missingPermissions,
      requiredRoles: result.requiredRoles,
      requiredPermissions: result.requiredPermissions
    };
  }, [access, routeOrKey]);
}
