import { useContext } from 'react';
import { RoutingContext } from '../providers/RoutingProvider.jsx';

export function useRouteRegistry() {
  const ctx = useContext(RoutingContext);
  if (!ctx) {
    throw new Error('useRouteRegistry must be used within a RoutingProvider');
  }

  return {
    addRoute: ctx.addRoute,
    getRoute: ctx.getRoute,
    getAllRoutes: ctx.getAllRoutes,
    removeRoute: ctx.removeRoute,
    clearRoutes: ctx.clearRoutes,
  };
}
