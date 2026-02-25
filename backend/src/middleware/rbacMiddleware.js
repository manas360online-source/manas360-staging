/**
 * ═══════════════════════════════════════════════════════════════
 * MANAS360 RBAC (Role-Based Access Control) MIDDLEWARE
 * Role verification and permission checking
 * ═══════════════════════════════════════════════════════════════
 */

import { pool } from '../config/database.js';
import { logAuditEvent } from '../services/auditService.js';

/**
 * MIDDLEWARE: Verify user role
 * Usage: router.delete('/users/:id', authorizeRole(['admin', 'superadmin']), controller);
 * 
 * @param {Array<string>} allowedRoles - Array of role names allowed
 */
export function authorizeRole(allowedRoles = []) {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            // Fetch user role
            const query = `
                SELECT r.name, r.privilege_level
                FROM user_accounts u
                JOIN roles r ON u.role_id = r.id
                WHERE u.id = $1 AND u.deleted_at IS NULL
            `;

            const result = await pool.query(query, [userId]);

            if (result.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'UserNotFound',
                    message: 'User not found'
                });
            }

            const userRole = result.rows[0];
            req.user.role = userRole.name;
            req.user.privilegeLevel = userRole.privilege_level;

            // Check if user's role is in allowed roles
            if (!allowedRoles.includes(userRole.name)) {
                // Log unauthorized access attempt
                await logAuditEvent(userId, 'unauthorized_access', 'failure',
                    req.ip, req.get('user-agent'), {
                        required_role: allowedRoles,
                        user_role: userRole.name,
                        endpoint: req.originalUrl
                    });

                return res.status(403).json({
                    success: false,
                    error: 'Forbidden',
                    message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
                });
            }

            next();

        } catch (error) {
            console.error('Authorization error:', error);
            res.status(500).json({
                success: false,
                error: 'AuthorizationError',
                message: 'Failed to verify role'
            });
        }
    };
}

/**
 * MIDDLEWARE: Check permission
 * Usage: router.get('/admin/dashboard', checkPermission('view_analytics'), controller);
 * 
 * @param {string|Array<string>} requiredPermissions - Permission name(s)
 */
export function checkPermission(requiredPermissions = []) {
    const permissions = Array.isArray(requiredPermissions) 
        ? requiredPermissions 
        : [requiredPermissions];

    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const roleId = req.user?.roleId;

            if (!userId || !roleId) {
                return res.status(401).json({
                    success: false,
                    error: 'Unauthorized',
                    message: 'Authentication required'
                });
            }

            // Fetch user permissions through role
            const query = `
                SELECT DISTINCT p.name
                FROM role_permissions rp
                JOIN permissions p ON rp.permission_id = p.id
                WHERE rp.role_id = $1
            `;

            const result = await pool.query(query, [roleId]);
            const userPermissions = result.rows.map(row => row.name);

            // Check if user has required permission
            const hasPermission = permissions.some(perm => 
                userPermissions.includes(perm)
            );

            if (!hasPermission) {
                // Log permission denied
                await logAuditEvent(userId, 'permission_denied', 'failure',
                    req.ip, req.get('user-agent'), {
                        required_permissions: permissions,
                        endpoint: req.originalUrl
                    });

                return res.status(403).json({
                    success: false,
                    error: 'PermissionDenied',
                    message: `Missing required permission: ${permissions.join(' or ')}`
                });
            }

            req.user.permissions = userPermissions;
            next();

        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                error: 'PermissionCheckError',
                message: 'Failed to verify permission'
            });
        }
    };
}

/**
 * Get user's permissions
 */
export async function getUserPermissions(userId) {
    try {
        const query = `
            SELECT DISTINCT p.id, p.name, p.resource, p.action
            FROM user_accounts u
            JOIN roles r ON u.role_id = r.id
            JOIN role_permissions rp ON r.id = rp.role_id
            JOIN permissions p ON rp.permission_id = p.id
            WHERE u.id = $1 AND u.deleted_at IS NULL
        `;

        const result = await pool.query(query, [userId]);
        return result.rows;

    } catch (error) {
        console.error('Error fetching user permissions:', error);
        return [];
    }
}

/**
 * HELPER: Check if user has minimum privilege level
 * Usage: if (req.user.privilegeLevel >= PRIVILEGE_LEVELS.ADMIN) { ... }
 */
export const PRIVILEGE_LEVELS = {
    GUEST: 0,
    USER: 10,
    SUBSCRIBER: 50,
    ADMIN: 90,
    SUPERADMIN: 100
};

export function requireMinimumPrivilege(minLevel) {
    return async (req, res, next) => {
        try {
            const userLevel = req.user?.privilegeLevel || 0;

            if (userLevel < minLevel) {
                await logAuditEvent(req.user?.id, 'insufficient_privilege', 'failure',
                    req.ip, req.get('user-agent'), {
                        required_level: minLevel,
                        user_level: userLevel
                    });

                return res.status(403).json({
                    success: false,
                    error: 'InsufficientPrivilege',
                    message: 'Your account privileges are insufficient for this action'
                });
            }

            next();

        } catch (error) {
            console.error('Privilege check error:', error);
            res.status(500).json({
                success: false,
                error: 'PrivilegeCheckError',
                message: 'Failed to verify privilege level'
            });
        }
    };
}

export default {
    authorizeRole,
    checkPermission,
    getUserPermissions,
    requireMinimumPrivilege,
    PRIVILEGE_LEVELS
};
