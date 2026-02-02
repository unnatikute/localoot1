/**
 * Role normalization utility for consistent role-based access control.
 * Backend may return: "user", "USER", "shopkeeper", "SHOPKEEPER", "admin", "ADMIN", "shop_owner", etc.
 * We normalize to: USER | SHOPKEEPER | ADMIN (uppercase)
 */
export const ROLES = {
  USER: "USER",
  SHOPKEEPER: "SHOPKEEPER",
  ADMIN: "ADMIN",
};

/**
 * Normalize any role string to one of USER, SHOPKEEPER, ADMIN
 * @param {string} rawRole - Role from backend or user object
 * @returns {string} Normalized role (USER | SHOPKEEPER | ADMIN)
 */
export function normalizeRole(rawRole) {
  if (!rawRole) return ROLES.USER;
  const s = String(rawRole).toLowerCase().replace(/^role_/, "").replace(/^roles?_/, "");
  if (s.includes("admin")) return ROLES.ADMIN;
  if (s.includes("shop") || s.includes("owner") || s.includes("keeper")) return ROLES.SHOPKEEPER;
  return ROLES.USER;
}

/**
 * Get normalized role from user object
 * @param {object} user - User object with role/roles/authorities
 * @returns {string} Normalized role
 */
export function getRoleFromUser(user) {
  if (!user) return null;
  const raw =
    user.role ||
    (user.roles && (Array.isArray(user.roles) ? user.roles[0] : user.roles)) ||
    (user.authorities && (Array.isArray(user.authorities) ? user.authorities[0] : user.authorities));
  return normalizeRole(raw);
}

/**
 * Check if user has one of the allowed roles
 * @param {object} user - User object
 * @param {string[]} allowedRoles - Array of allowed roles (e.g. ["USER", "ADMIN"])
 * @returns {boolean}
 */
export function hasRole(user, allowedRoles) {
  if (!user || !allowedRoles?.length) return false;
  const role = getRoleFromUser(user);
  return allowedRoles.some((r) => r.toUpperCase() === role);
}

export function isAdmin(user) {
  return hasRole(user, [ROLES.ADMIN]);
}

export function isShopkeeper(user) {
  return hasRole(user, [ROLES.SHOPKEEPER]);
}

export function isUser(user) {
  return hasRole(user, [ROLES.USER]);
}
