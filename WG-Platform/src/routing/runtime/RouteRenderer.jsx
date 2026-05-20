import React from 'react';
import { Outlet, Route } from 'react-router-dom';
import { normalizePath } from '../utils/pathHelpers.js';
import { ProtectedRoute } from './ProtectedRoute.jsx';
import { RouteLayoutRenderer } from './RouteLayoutRenderer.jsx';
import { validateRoutePolicy } from './policy/routePolicy.js';

function hasRenderableComponent(route) {
  return !!(route?.component || route?.element);
}

function hasChildren(route) {
  return Array.isArray(route?.children) && route.children.length > 0;
}

function renderRouteComponent(route) {
  const component = route?.component || route?.element;

  if (React.isValidElement(component)) {
    return component;
  }

  if (typeof component === 'function') {
    return React.createElement(component);
  }

  if (hasChildren(route)) {
    return <Outlet />;
  }

  return null;
}

function resolveRoutePath(path, nested) {
  if (!nested) {
    return normalizePath(path);
  }

  const value = String(path || '');
  return value.startsWith('/') ? value : value.replace(/^\/+/, '');
}

export function validateRouteConfig(route) {
  const errors = [];

  if (!route || typeof route !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'route', message: 'Route must be an object.' }]
    };
  }

  if (!route.key) {
    errors.push({ field: 'key', message: 'Route must have a key.' });
  }

  if (!route.path) {
    errors.push({ field: 'path', message: 'Route must have a path.' });
  }

  if (route.children !== undefined && !Array.isArray(route.children)) {
    errors.push({
      field: 'children',
      message: 'Route children must be an array when provided.'
    });
  }

  const policyValidation = validateRoutePolicy(route);

  return {
    valid: errors.length === 0 && policyValidation.valid,
    errors: [...errors, ...policyValidation.errors]
  };
}

export function isRenderableRoute(route) {
  return validateRouteConfig(route).valid;
}

export function RouteRenderer({
  route,
  access,
  layouts,
  defaultLayout,
  fallbackPath,
  unauthorizedElement,
  nested = false
}) {
  if (!isRenderableRoute(route)) {
    return null;
  }

  const routeElement = renderRouteComponent(route);
  const withLayout = (
    <RouteLayoutRenderer
      route={route}
      layouts={layouts}
      defaultLayout={defaultLayout}
    >
      {routeElement}
    </RouteLayoutRenderer>
  );
  const element = (
    <ProtectedRoute
      route={route}
      access={access}
      fallbackPath={fallbackPath}
      unauthorizedElement={unauthorizedElement}
    >
      {withLayout}
    </ProtectedRoute>
  );
  const children = hasChildren(route)
    ? route.children.filter(isRenderableRoute)
    : [];

  return (
    <Route path={resolveRoutePath(route.path, nested)} element={element}>
      {children.map((childRoute) => {
        const childElement = RouteRenderer({
          route: childRoute,
          access,
          layouts,
          defaultLayout,
          fallbackPath,
          unauthorizedElement,
          nested: true
        });

        return childElement
          ? React.cloneElement(childElement, {
              key: childRoute.key || childRoute.path
            })
          : null;
      })}
    </Route>
  );
}
