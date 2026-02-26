export function requireAuth(req, res, next) {
  if (!req.user?.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  return next();
}

export function requireRole(allowedRoles = []) {
  return (req, res, next) => {
    const currentRole = String(req.user?.role || '').toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map((role) => String(role).toLowerCase());

    if (!currentRole || !normalizedAllowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient privileges'
      });
    }

    return next();
  };
}

export function requirePermission(requiredPermissions = []) {
  return (req, res, next) => {
    const permissions = new Set(req.user?.permissions || []);
    const missing = requiredPermissions.filter((permission) => !permissions.has(permission));

    if (missing.length > 0) {
      return res.status(403).json({
        success: false,
        message: 'Missing required permission(s)',
        missing
      });
    }

    return next();
  };
}
