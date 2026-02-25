/**
 * ════════════════════════════════════════════════════════════════════════════
 * ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE - UNIFIED
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Enforces access control at two levels:
 * 1. Role-based: Check if user has specific role(s)
 * 2. Permission-based: Check if user has specific permission(s)
 * 
 * Requires: authenticateToken middleware MUST run before RBAC checks
 * 
 * Usage:
 *   route.delete('/users/:id',
 *     authenticateToken,
 *     authorizeRole(['admin']),
 *     deleteUserHandler
 *   )
 * 
 * Author: Backend Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Role-based authorization
 * 
 * @param {string[]} allowedRoles - Array of allowed role names
 * @returns {Function} Express middleware
 * 
 * Example:
 *   authorizeRole(['admin'])
 *   authorizeRole(['admin', 'superadmin'])
 *   authorizeRole(['therapist', 'admin'])
 */
export const authorizeRole = (allowedRoles = []) => {
  if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
    throw new Error('authorizeRole: allowedRoles must be non-empty array');
  }

  return (req, res, next) => {
    // Must be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        action: 'login'
      });
    }

    // Check if user role is in allowed list
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions for this action',
        required: `one of: ${allowedRoles.join(', ')}`,
        userRole: req.user.role,
        action: 'upgrade_or_contact_support'
      });
    }

    // Authorization passed
    next();
  };
};

/**
 * Permission-based authorization
 * 
 * @param {string[]} requiredPermissions - Array of required permission names
 * @returns {Function} Express middleware
 * 
 * Behavior:
 * - User must have AT LEAST ONE of the required permissions
 * - Useful for granular access control
 * 
 * Example:
 *   authorizePermission(['view_analytics'])
 *   authorizePermission(['manage_users', 'audit_logs'])
 */
export const authorizePermission = (requiredPermissions = []) => {
  if (!Array.isArray(requiredPermissions) || requiredPermissions.length === 0) {
    throw new Error('authorizePermission: requiredPermissions must be non-empty array');
  }

  return (req, res, next) => {
    // Must be authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        action: 'login'
      });
    }

    // Check if user has any of the required permissions
    const userPermissions = req.user.permissions || [];
    const hasPermission = requiredPermissions.some(perm =>
      userPermissions.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Missing required permissions for this action',
        required: requiredPermissions,
        userPermissions: userPermissions,
        action: 'request_access_or_upgrade'
      });
    }

    // Authorization passed
    next();
  };
};

/**
 * Role AND permission requirement
 * 
 * @param {string} requiredRole - Single role required
 * @param {string[]} requiredPermissions - At least one permission required
 * @returns {Function} Express middleware
 * 
 * Example:
 *   authorizeRoleAndPermission('admin', ['manage_users', 'audit_logs'])
 *   // User must be 'admin' AND have at least one of the permissions
 */
export const authorizeRoleAndPermission = (requiredRole, requiredPermissions = []) => {
  return (req, res, next) => {
    // Check role first
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient role for this action',
        required: requiredRole,
        userRole: req.user?.role || 'guest'
      });
    }

    // If permissions specified, check those too
    if (requiredPermissions.length > 0) {
      const userPermissions = req.user.permissions || [];
      const hasPermission = requiredPermissions.some(perm =>
        userPermissions.includes(perm)
      );

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: 'Role is correct but missing required permissions',
          requiredPermissions,
          userPermissions
        });
      }
    }

    next();
  };
};

/**
 * Resource ownership check
 * 
 * Ensures user can only access their own resource
 * unless they are an admin
 * 
 * @param {string} paramName - Request param name containing resource owner id
 * @returns {Function} Express middleware
 * 
 * Example:
 *   route.get('/users/:userId/profile',
 *     authenticateToken,
 *     checkResourceOwnership('userId'),
 *     getProfileHandler
 *   )
 */
export const checkResourceOwnership = (paramName = 'userId') => {
  return (req, res, next) => {
    const resourceOwnerId = req.params[paramName];
    const requesterId = req.user?.userId;
    const requesterRole = req.user?.role;

    // Admins can access any resource
    if (requesterRole === 'admin') {
      return next();
    }

    // Non-admins can only access their own resources
    if (requesterId !== resourceOwnerId) {
      return res.status(403).json({
        success: false,
        message: 'You can only access your own resources',
        action: 'use_correct_id'
      });
    }

    next();
  };
};

/**
 * Multiple all required roles
 * 
 * User must have ALL of the specified roles (if roles are array-based)
 * Note: Current system uses single role per user, so this checks if role
 * is in the list
 * 
 * @param {string[]} requiredRoles
 * @returns {Function} Express middleware
 */
export const authorizeAllRoles = (requiredRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    // Since each user has only ONE role, check if it's in the required list
    // (This is equivalent to authorizeRole for single-role systems)
    if (!requiredRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User must have one of these roles: ${requiredRoles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Multiple all required permissions
 * 
 * User must have ALL of the specified permissions
 * More restrictive than authorizePermission
 * 
 * @param {string[]} requiredPermissions
 * @returns {Function} Express middleware
 */
export const authorizeAllPermissions = (requiredPermissions = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const userPermissions = req.user.permissions || [];

    // Check if user has ALL required permissions
    const hasAllPermissions = requiredPermissions.every(perm =>
      userPermissions.includes(perm)
    );

    if (!hasAllPermissions) {
      const missing = requiredPermissions.filter(p => !userPermissions.includes(p));
      return res.status(403).json({
        success: false,
        message: 'Missing required permissions',
        missingPermissions: missing,
        requiredPermissions: requiredPermissions,
        userPermissions: userPermissions
      });
    }

    next();
  };
};

/**
 * Combined middleware: Common pattern for admin routes
 * 
 * Usage:
 *   route.get('/admin/users', adminOnly, listUsers)
 */
export const adminOnly = authorizeRole(['admin']);

/**
 * Combined middleware: For therapist routes
 */
export const therapistOnly = authorizeRole(['therapist']);

/**
 * Combined middleware: For authenticated users (any role)
 */
export const authenticatedUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }
  next();
};

export default {
  authorizeRole,
  authorizePermission,
  authorizeRoleAndPermission,
  checkResourceOwnership,
  authorizeAllRoles,
  authorizeAllPermissions,
  adminOnly,
  therapistOnly,
  authenticatedUser
};
