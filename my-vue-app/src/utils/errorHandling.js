/**
 * Error handling utilities for consistent error management across the application
 */

export const ErrorTypes = {
  RATE_LIMIT: 'RATE_LIMIT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  VALIDATION: 'VALIDATION',
  NETWORK: 'NETWORK',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN'
};

export const getErrorType = (error) => {
  if (!error.response) {
    return ErrorTypes.NETWORK;
  }
  
  const { status } = error.response;
  
  switch (status) {
    case 401:
      return ErrorTypes.UNAUTHORIZED;
    case 422:
    case 400:
      return ErrorTypes.VALIDATION;
    case 429:
      return ErrorTypes.RATE_LIMIT;
    case 500:
    case 502:
    case 503:
      return ErrorTypes.SERVER;
    default:
      return ErrorTypes.UNKNOWN;
  }
};

export const getErrorMessage = (error) => {
  const errorType = getErrorType(error);
  
  switch (errorType) {
    case ErrorTypes.RATE_LIMIT:
      return 'Too many requests. Please wait a moment before trying again.';
    case ErrorTypes.UNAUTHORIZED:
      return 'Your session has expired. Please log in again.';
    case ErrorTypes.VALIDATION:
      return error.response?.data?.error || 'Invalid data provided. Please check your input.';
    case ErrorTypes.NETWORK:
      return 'Network error. Please check your internet connection.';
    case ErrorTypes.SERVER:
      return 'Server error. Please try again later.';
    default:
      return error.response?.data?.error || 'An unexpected error occurred. Please try again.';
  }
};

export const handleError = (error, options = {}) => {
  const { 
    onUnauthorized, 
    showAlert = true, 
    customMessage, 
    onRateLimit,
    silent = false 
  } = options;
  
  const errorType = getErrorType(error);
  const message = customMessage || getErrorMessage(error);
  
  console.error('Error occurred:', error);
  
  // Handle specific error types
  switch (errorType) {
    case ErrorTypes.UNAUTHORIZED:
      if (onUnauthorized) {
        onUnauthorized();
      }
      return { type: errorType, message, shouldRedirect: true };
      
    case ErrorTypes.RATE_LIMIT:
      if (onRateLimit) {
        onRateLimit();
      }
      if (!silent && showAlert) {
        alert(message);
      }
      return { type: errorType, message, shouldThrottle: true };
      
    default:
      if (!silent && showAlert) {
        alert(message);
      }
      return { type: errorType, message };
  }
};

export const createErrorHandler = (defaultOptions = {}) => {
  return (error, options = {}) => {
    return handleError(error, { ...defaultOptions, ...options });
  };
};

// Hook for error handling in components
export const useErrorHandler = (onUnauthorized) => {
  return (error, options = {}) => {
    return handleError(error, { onUnauthorized, ...options });
  };
};