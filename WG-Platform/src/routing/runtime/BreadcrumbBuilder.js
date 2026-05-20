import { matchPath } from 'react-router-dom';
import { buildPath, normalizePath } from '../utils/pathHelpers.js';
import { getAllRoutes } from '../registry/routeRegistry.js';

function trimSlashes(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function joinRoutePaths(parentPath, childPath) {
  const child = String(childPath || '');

  if (child.startsWith('/')) {
    return normalizePath(child);
  }

  const parent = trimSlashes(parentPath);
  const relativeChild = trimSlashes(child);
  const joined = [parent, relativeChild].filter(Boolean).join('/');
  return normalizePath(joined);
}

function flattenRoutes(routes = [], parentPath = '', parentChain = []) {
  return routes.reduce((entries, route) => {
    if (!route || !route.path) {
      return entries;
    }

    const fullPath = joinRoutePaths(parentPath, route.path);
    const chain = [...parentChain, { route, fullPath }];

    entries.push({ route, fullPath, chain });

    if (Array.isArray(route.children) && route.children.length > 0) {
      entries.push(...flattenRoutes(route.children, fullPath, chain));
    }

    return entries;
  }, []);
}

function getBreadcrumbLabel(route, context) {
  if (typeof route.breadcrumb === 'function') {
    return route.breadcrumb(context);
  }

  if (route.breadcrumb !== undefined && route.breadcrumb !== null) {
    if (typeof route.breadcrumb === 'object' && 'label' in route.breadcrumb) {
      return route.breadcrumb.label;
    }

    return route.breadcrumb;
  }

  return (
    route.metadata?.title ||
    route.metadata?.label ||
    route.sidebar?.label ||
    route.key
  );
}

function routeMatch(fullPath, pathname, end) {
  if (fullPath === '*') return null;

  return matchPath(
    {
      path: fullPath,
      end
    },
    pathname
  );
}

export function buildBreadcrumbs({
  routes = getAllRoutes(),
  pathname = '/',
  includeHidden = false
} = {}) {
  const normalizedPathname = normalizePath(pathname);
  const entries = flattenRoutes(Array.isArray(routes) ? routes : []);
  const matchedEntries = entries
    .map((entry) => ({
      ...entry,
      match: routeMatch(entry.fullPath, normalizedPathname, false)
    }))
    .filter((entry) => entry.match)
    .sort((a, b) => a.fullPath.length - b.fullPath.length);

  return matchedEntries
    .filter(({ route }) => includeHidden || route.sidebar?.hidden !== true)
    .map(({ route, fullPath, match }) => {
      const params = match?.params || {};
      return {
        key: route.key,
        label: getBreadcrumbLabel(route, {
          route,
          params,
          pathname: normalizedPathname
        }),
        path: buildPath(fullPath, params),
        route,
        params
      };
    });
}
