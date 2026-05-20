function normalizeList(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function hasAnyRole(requiredRoles, accessRoles) {
  if (requiredRoles.length === 0) return true;
  return requiredRoles.some((role) => accessRoles.includes(role));
}

function hasAllPermissions(requiredPermissions, accessPermissions) {
  if (requiredPermissions.length === 0) return true;
  return requiredPermissions.every((permission) =>
    accessPermissions.includes(permission)
  );
}

function createPolicyError(field, code, message) {
  return { field, code, message };
}

export function validateRoutePolicy(route) {
  const errors = [];

  if (!route || typeof route !== 'object') {
    return {
      valid: false,
      errors: [
        createPolicyError('route', 'invalid_route', 'Route must be an object.')
      ]
    };
  }

  if (
    route.protected !== undefined &&
    route.protected !== null &&
    typeof route.protected !== 'boolean'
  ) {
    errors.push(
      createPolicyError(
        'protected',
        'invalid_protected',
        'Route protected must be a boolean when provided.'
      )
    );
  }

  if (route.roles !== undefined && route.roles !== null) {
    if (
      !Array.isArray(route.roles) ||
      route.roles.some((role) => typeof role !== 'string')
    ) {
      errors.push(
        createPolicyError(
          'roles',
          'invalid_roles',
          'Route roles must be an array of strings when provided.'
        )
      );
    }
  }

  if (route.permissions !== undefined && route.permissions !== null) {
    if (
      !Array.isArray(route.permissions) ||
      route.permissions.some((permission) => typeof permission !== 'string')
    ) {
      errors.push(
        createPolicyError(
          'permissions',
          'invalid_permissions',
          'Route permissions must be an array of strings when provided.'
        )
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function evaluateRouteAccess(route, access = {}) {
  const validation = validateRoutePolicy(route);

  if (!validation.valid) {
    return {
      allowed: false,
      reason: 'invalid-policy',
      validation,
      missingPermissions: [],
      requiredRoles: normalizeList(route?.roles),
      requiredPermissions: normalizeList(route?.permissions)
    };
  }

  const requiredRoles = normalizeList(route.roles);
  const requiredPermissions = normalizeList(route.permissions);
  const requiresAccess =
    route.protected === true ||
    requiredRoles.length > 0 ||
    requiredPermissions.length > 0;

  if (!requiresAccess) {
    return {
      allowed: true,
      reason: 'public',
      validation,
      missingPermissions: [],
      requiredRoles,
      requiredPermissions
    };
  }

  const isAuthenticated = access?.isAuthenticated === true;

  if (!isAuthenticated) {
    return {
      allowed: false,
      reason: 'unauthenticated',
      validation,
      missingPermissions: requiredPermissions,
      requiredRoles,
      requiredPermissions
    };
  }

  const accessRoles = normalizeList(access.roles);
  const accessPermissions = normalizeList(access.permissions);

  if (!hasAnyRole(requiredRoles, accessRoles)) {
    return {
      allowed: false,
      reason: 'missing-role',
      validation,
      missingPermissions: [],
      requiredRoles,
      requiredPermissions
    };
  }

  if (!hasAllPermissions(requiredPermissions, accessPermissions)) {
    return {
      allowed: false,
      reason: 'missing-permission',
      validation,
      missingPermissions: requiredPermissions.filter(
        (permission) => !accessPermissions.includes(permission)
      ),
      requiredRoles,
      requiredPermissions
    };
  }

  return {
    allowed: true,
    reason: 'allowed',
    validation,
    missingPermissions: [],
    requiredRoles,
    requiredPermissions
  };
}

export function canAccessRoute(route, access = {}) {
  return evaluateRouteAccess(route, access).allowed;
}
