export function requireAdminMfa(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (String(req.user.role).toLowerCase() === 'admin' && !req.user.mfaVerified) {
    return res.status(403).json({
      success: false,
      message: 'Admin MFA verification required',
      code: 'ADMIN_MFA_REQUIRED'
    });
  }

  return next();
}

export default {
  requireAdminMfa
};
