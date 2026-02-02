/**
 * Validation utilities for form inputs and data
 */

/**
 * Validate email format
 */
export function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate search query (alphanumeric, spaces, some special chars)
 */
export function validateSearchQuery(query, maxLength = 100) {
  if (!query || typeof query !== 'string') return { valid: false, error: 'Search query is required' };
  if (query.length > maxLength) return { valid: false, error: `Search query must be less than ${maxLength} characters` };
  if (query.trim().length === 0) return { valid: false, error: 'Search query cannot be empty' };
  
  // Allow alphanumeric, spaces, hyphens, apostrophes, and common punctuation
  const searchRegex = /^[a-zA-Z0-9\s\-'.,!?()]+$/;
  if (!searchRegex.test(query)) {
    return { valid: false, error: 'Search query contains invalid characters' };
  }
  
  return { valid: true, error: null };
}

/**
 * Sanitize search input
 */
export function sanitizeSearchInput(input) {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, ''); // Remove potential HTML tags
}

/**
 * Validate area selection
 */
export function validateArea(areaId, areas) {
  if (!areaId) return { valid: true, error: null }; // Area is optional
  if (!areas || !Array.isArray(areas)) return { valid: false, error: 'Invalid areas list' };
  
  const areaExists = areas.some(a => a.id.toString() === areaId.toString());
  if (!areaExists) return { valid: false, error: 'Selected area is invalid' };
  
  return { valid: true, error: null };
}

/**
 * Validate price range
 */
export function validatePriceRange(minPrice, maxPrice) {
  if (minPrice !== null && minPrice !== undefined && minPrice < 0) {
    return { valid: false, error: 'Minimum price cannot be negative' };
  }
  if (maxPrice !== null && maxPrice !== undefined && maxPrice < 0) {
    return { valid: false, error: 'Maximum price cannot be negative' };
  }
  if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
    return { valid: false, error: 'Minimum price cannot be greater than maximum price' };
  }
  return { valid: true, error: null };
}

/**
 * Validate discount range
 */
export function validateDiscountRange(minDiscount, maxDiscount) {
  if (minDiscount !== null && minDiscount !== undefined && (minDiscount < 0 || minDiscount > 100)) {
    return { valid: false, error: 'Minimum discount must be between 0 and 100' };
  }
  if (maxDiscount !== null && maxDiscount !== undefined && (maxDiscount < 0 || maxDiscount > 100)) {
    return { valid: false, error: 'Maximum discount must be between 0 and 100' };
  }
  if (minDiscount !== null && maxDiscount !== null && minDiscount > maxDiscount) {
    return { valid: false, error: 'Minimum discount cannot be greater than maximum discount' };
  }
  return { valid: true, error: null };
}

/**
 * Validate rating range
 */
export function validateRatingRange(minRating, maxRating) {
  if (minRating !== null && minRating !== undefined && (minRating < 0 || minRating > 5)) {
    return { valid: false, error: 'Minimum rating must be between 0 and 5' };
  }
  if (maxRating !== null && maxRating !== undefined && (maxRating < 0 || maxRating > 5)) {
    return { valid: false, error: 'Maximum rating must be between 0 and 5' };
  }
  if (minRating !== null && maxRating !== null && minRating > maxRating) {
    return { valid: false, error: 'Minimum rating cannot be greater than maximum rating' };
  }
  return { valid: true, error: null };
}

/**
 * Validate pagination parameters
 */
export function validatePagination(page, pageSize) {
  const pageNum = parseInt(page, 10);
  const size = parseInt(pageSize, 10);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return { valid: false, error: 'Page number must be a positive integer' };
  }
  if (isNaN(size) || size < 1 || size > 100) {
    return { valid: false, error: 'Page size must be between 1 and 100' };
  }
  
  return { valid: true, error: null, page: pageNum, pageSize: size };
}

/**
 * Debounce function for search inputs
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
