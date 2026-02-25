// ================================================================
// Global Error Handler Middleware
// ================================================================
// Centralized error handling for entire application
// Formats all errors consistently
// Logs errors appropriately based on severity
// ================================================================

import { isDevelopment } from '../config/environment-unified.js';

/**
 * Custom application error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
  constructor(message, field) {
    super(message, 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Authentication error class
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error class
 */
export class AuthorizationError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error class
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Global error handler middleware
 * MUST be defined last in Express app
 * Usage: app.use(errorHandler())
 */
export function errorHandler() {
  return (err, req, res, next) => {
    const {
      name,
      message,
      statusCode = 500,
      field,
      stack,
    } = err;

    // ================================================================
    // DETERMINE RESPONSE STATUS CODE
    // ================================================================

    let responseStatusCode = statusCode;

    // Handle database errors
    if (name === 'Error' && message.includes('duplicate key')) {
      responseStatusCode = 409; // Conflict
    } else if (name === 'Error' && message.includes('foreign key')) {
      responseStatusCode = 400; // Bad Request
    }

    // ================================================================
    // LOG ERROR
    // ================================================================

    const errorLog = {
      timestamp: new Date().toISOString(),
      error: name,
      message,
      statusCode: responseStatusCode,
      path: req.path,
      method: req.method,
      ip: req.ip,
      userId: req.user?.id || null,
    };

    // Log stack trace only in development or for 5xx errors
    if (isDevelopment() || responseStatusCode >= 500) {
      errorLog.stack = stack;
    }

    if (responseStatusCode >= 500) {
      console.error('❌ Server Error:', errorLog);
    } else if (responseStatusCode >= 400) {
      console.warn('⚠️  Client Error:', errorLog);
    }

    // ================================================================
    // BUILD ERROR RESPONSE
    // ================================================================

    const errorResponse = {
      success: false,
      error: {
        name,
        message,
        ...(field && { field }),
      },
    };

    // Include stack trace only in development
    if (isDevelopment() && stack) {
      errorResponse.error.stack = stack.split('\n');
    }

    // ================================================================
    // SEND RESPONSE
    // ================================================================

    res.status(responseStatusCode).json(errorResponse);
  };
}

/**
 * Async route wrapper
 * Catches async errors and passes to error handler
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default errorHandler;
