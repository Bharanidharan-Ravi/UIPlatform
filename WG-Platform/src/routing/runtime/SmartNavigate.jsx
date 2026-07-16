// src/app/SmartNavigate.jsx
import { buildPath, normalizePath } from '../utils/pathHelpers.js';
import { PATHS } from '../constants/PATHS.js';
import { ROUTE_KEYS } from '../constants/ROUTE_KEYS.js';
import { getAllRoutes, getRoute } from '../registry/routeRegistry.js';

function trimSlashes(value) {
  return String(value || '').replace(/^\/+|\/+$/g, '');
}

function joinRoutePaths(parentPath, childPath) {
  const child = String(childPath || '');

  if (child.startsWith('/')) {
    return child;
  }

  const parent = trimSlashes(parentPath);
  const relativeChild = trimSlashes(child);
  return normalizePath([parent, relativeChild].filter(Boolean).join('/'));
}

function findRegisteredPath(routeKey, routeList = getAllRoutes(), parentPath = '') {
  for (const route of routeList) {
    if (!route?.path) {
      continue;
    }

    const fullPath = joinRoutePaths(parentPath, route.path);

    if (route.key === routeKey) {
      return fullPath;
    }

    if (Array.isArray(route.children)) {
      const childPath = findRegisteredPath(routeKey, route.children, fullPath);
      if (childPath) {
        return childPath;
      }
    }
  }

  return undefined;
}

function appendNavigationParts(path, options = {}) {
  const search = options.search
    ? String(options.search).replace(/^\?/, '')
    : '';
  const hash = options.hash ? String(options.hash).replace(/^#/, '') : '';
  const withSearch = search ? `${path}?${search}` : path;
  return hash ? `${withSearch}#${hash}` : withSearch;
}

function resolvePathTemplate(routeKeyOrPath) {
  if (!routeKeyOrPath) return PATHS.HOME || '/';

  const registeredPath = findRegisteredPath(routeKeyOrPath);
  if (registeredPath) {
    return registeredPath;
  }

  const registeredRoute = getRoute(routeKeyOrPath);
  if (registeredRoute?.path) {
    return registeredRoute.path;
  }

  if (PATHS[routeKeyOrPath]) {
    return PATHS[routeKeyOrPath];
  }

  const constantKey = Object.keys(ROUTE_KEYS).find(
    (key) => ROUTE_KEYS[key] === routeKeyOrPath
  );

  if (constantKey && PATHS[constantKey]) {
    return PATHS[constantKey];
  }

  return routeKeyOrPath;
}

/**
 * LAYER B/DYNAMIC STEPPING SUPPORT
 * Recursively parses layout-agnostic configuration arrays to determine sibling step anchors
 */
export function findSequentialSibling(currentRouteKey, direction = 1, routeList = getAllRoutes()) {
  for (const route of routeList) {
    if (Array.isArray(route.children)) {
      const matchIndex = route.children.findIndex(child => child.key === currentRouteKey);
      
      if (matchIndex !== -1) {
        const targetSibling = route.children[matchIndex + direction];
        return targetSibling ? targetSibling.key : null;
      }
      
      const deepMatch = findSequentialSibling(currentRouteKey, direction, route.children);
      if (deepMatch) return deepMatch;
    }
  }
  return null;
}

export function buildNavigationPath(routeKeyOrPath, params = {}, options = {}) {
  const template = resolvePathTemplate(routeKeyOrPath);

  // =========================================================
  // LAYER D: DYNAMIC PARAMETER SCHEMA VALIDATOR
  // =========================================================
  const dynamicParamMatches = template.match(/:[a-zA-Z0-9_]+/g) || [];
  
  for (const match of dynamicParamMatches) {
    const paramName = match.replace(':', '');
    
    // Explicitly confirm whether the matching element parameter is marked optional ('?')
    const isOptional = template.includes(`${match}?`);
    
    if (!isOptional && (params[paramName] === undefined || params[paramName] === null || String(params[paramName]).trim() === '')) {
      console.error(
        `%c[Platform Navigation Error]%c Missing required URL parameter: %c"${paramName}"%c for route key/path: %c"${routeKeyOrPath}"%c.\nTemplate blueprint expected: "${template}"`,
        "color: white; background: #ef4444; padding: 2px 4px; border-radius: 4px; font-weight: bold;",
        "color: #ef4444; font-weight: bold;",
        "color: #1e293b; font-weight: bold; background: #f1f5f9; padding: 1px 4px; border-radius: 2px;",
        "color: #ef4444;",
        "color: #1e293b; font-weight: bold; background: #f1f5f9; padding: 1px 4px; border-radius: 2px;",
        "color: inherit;"
      );
    }
  }
  // =========================================================

  const builtPath = buildPath(normalizePath(template), params);
  return appendNavigationParts(builtPath, options);
}

export function navigateWithParams(
  navigate,
  routeKeyOrPath,
  params = {},
  options = {}
) {
  if (typeof navigate !== 'function') {
    return undefined;
  }

  const { replace, state, ...pathOptions } = options;
  const path = buildNavigationPath(routeKeyOrPath, params, pathOptions);
  return navigate(path, { replace, state });
}

export function goToRouteKey(navigate, routeKey, params = {}, options = {}) {
  return navigateWithParams(navigate, routeKey, params, options);
}

export function goBackSafe(navigate, fallbackRouteKeyOrPath = '/', options = {}) {
  if (typeof navigate !== 'function') {
    return undefined;
  }

  const canGoBack =
    typeof window !== 'undefined' &&
    window.history &&
    window.history.length > 1 &&
    options.forceFallback !== true;

  if (canGoBack) {
    return navigate(-1);
  }

  const resolvedPath = buildNavigationPath(
    fallbackRouteKeyOrPath, 
    options.fallbackParams || {}, 
    options
  );

  return navigate(resolvedPath, {
    replace: options.replace !== undefined ? options.replace : true,
    state: options.state
  });
}