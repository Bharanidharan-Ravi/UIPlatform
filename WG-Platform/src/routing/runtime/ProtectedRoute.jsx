import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { evaluateRouteAccess } from './policy/routePolicy.js';

function normalizeComparablePath(path) {
  if (!path) return '/';
  const value = String(path).split('?')[0].split('#')[0] || '/';
  return value.length > 1 && value.endsWith('/') ? value.slice(0, -1) : value;
}

function isSamePath(currentPath, nextPath) {
  return normalizeComparablePath(currentPath) === normalizeComparablePath(nextPath);
}

export function ProtectedRoute({
  children,
  route,
  access,
  fallbackPath = '/',
  unauthorizedElement = null
}) {
  const location = useLocation();
  const result = evaluateRouteAccess(route, access);

  if (result.allowed) {
    return children;
  }

  if (!fallbackPath || isSamePath(location.pathname, fallbackPath)) {
    return unauthorizedElement;
  }

  return (
    <Navigate
      to={fallbackPath}
      replace
      state={{
        from: location,
        deniedRouteKey: route?.key,
        reason: result.reason
      }}
    />
  );
}
