/**
 * ════════════════════════════════════════════════════════════════════════════
 * GLOBAL ERROR HANDLER & UTILITY MIDDLEWARE
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Centralizes error handling across entire application
 * Catches and formats all errors into consistent JSON responses
 * 
 * Author: Backend Team
 * Created: Feb 2026
 * ════════════════════════════════════════════════════════════════════════════
 */

/**
 * Custom error classes
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400);
    this.field = field;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message) {
    super(message, 409);
  }
}

/**
 * Global error handler middleware
 * 
 * MUST be the last middleware in the Express app
 * 
 * Usage:
 *   app.use(globalErrorHandler);
 */
export const globalErrorHandler = (err, req, res, next) => {
  // Default error properties
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new NotFoundError(message);
  }

  // Duplicate key error
  if (err.code === 23505) { // PostgreSQL duplicate key
    const field = err.detail?.split('Key')[1]?.split('=')[0]?.trim() || 'unknown';
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    err = new ConflictError(message);
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Invalid token`;
    err = new AuthenticationError(message);
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    const message = `Token has expired`;
    err = new AuthenticationError(message);
  }

  // Validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors
    });
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { error: err }),
    ...(err.statusCode === 400 && err.field && { field: err.field })
  });
};

/**
 * Async handler wrapper
 * 
 * Wraps async route handlers to catch errors
 * Eliminates try-catch in every route
 * 
 * Usage:
 *   router.get('/users', asyncHandler(async (req, res) => {
 *     const users = await User.find();
 *     res.json(users);
 *   }))
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for unmatched routes
 * 
 * Usage:
 *   app.use(notFoundHandler);
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    path: req.path,
    method: req.method
  });
};

/**
 * Request validation helper
 * 
 * Usage:
 *   router.post('/users', (req, res, next) => {
 *     validateRequest(req, { email: 'required|email', name: 'required|string' }, next);
 *   }, createUser);
 */
export const validateRequest = (req, rules, next) => {
  const errors = {};

  Object.entries(rules).forEach(([field, rule]) => {
    const value = req.body[field];
    const ruleList = rule.split('|');

    ruleList.forEach(r => {
      if (r === 'required' && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`;
      }
      if (r === 'email' && value && !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors[field] = `${field} must be a valid email`;
      }
      if (r === 'string' && value && typeof value !== 'string') {
        errors[field] = `${field} must be a string`;
      }
      if (r === 'number' && value && isNaN(value)) {
        errors[field] = `${field} must be a number`;
      }
      if (r === 'uuid' && value && !value.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        errors[field] = `${field} must be a valid UUID`;
      }
    });
  });

  if (Object.keys(errors).length > 0) {
    return next(new ValidationError('Validation failed', Object.values(errors)[0]));
  }

  next();
};

/**
 * Sanitize response (remove sensitive data)
 * 
 * Usage:
 *   res.json(sanitizeResponse(userData));
 */
export const sanitizeResponse = (data) => {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponse(item));
  }

  if (typeof data === 'object') {
    const sanitized = { ...data };
    
    // Remove sensitive fields
    delete sanitized.password_hash;
    delete sanitized.password;
    delete sanitized.twofa_secret;
    delete sanitized.token_hash;
    delete sanitized.api_secret;
    
    return sanitized;
  }

  return data;
};

/**
 * Debug middleware (logs all requests)
 * 
 * Usage:
 *   if (process.env.NODE_ENV === 'development') {
 *     app.use(debugMiddleware);
 *   }
 */
export const debugMiddleware = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  console.log('Headers:', req.headers);
  next();
};

/**
 * Request timeout middleware
 * 
 * Usage:
 *   app.use(requestTimeout(30000)); // 30 second timeout
 */
export const requestTimeout = (ms = 30000) => {
  return (req, res, next) => {
    const timer = setTimeout(() => {
      res.status(408).json({
        success: false,
        message: 'Request timeout'
      });
    }, ms);

    res.on('finish', () => clearTimeout(timer));
    next();
  };
};

/**
 * Add request ID for tracing
 * 
 * Usage:
 *   app.use(requestIdMiddleware);
 */
export const requestIdMiddleware = (req, res, next) => {
  req.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader('X-Request-ID', req.id);
  next();
};

export default {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  globalErrorHandler,
  asyncHandler,
  notFoundHandler,
  validateRequest,
  sanitizeResponse,
  debugMiddleware,
  requestTimeout,
  requestIdMiddleware
};
