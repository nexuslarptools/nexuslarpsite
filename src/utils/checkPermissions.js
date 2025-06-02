import { useAuth0 } from '@auth0/auth0-react';
import { logAuthorizationEvent, SEVERITY_LEVELS } from './securityLogger';

/**
 * Custom hook to check if the user has the required permissions
 * @param {string[]} requiredPermissions - Array of permissions required to access a resource
 * @returns {boolean} - True if the user has all required permissions, false otherwise
 */
export const useHasPermissions = (requiredPermissions = []) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading || !isAuthenticated || !user) {
    // Don't log during loading state, but log if authentication check fails
    if (!isLoading && (!isAuthenticated || !user)) {
      logAuthorizationEvent('Permission check failed: User not authenticated', SEVERITY_LEVELS.WARNING, {
        requiredPermissions,
        isAuthenticated,
        hasUser: !!user
      });
    }
    return false;
  }

  // If no permissions are required, return true
  if (requiredPermissions.length === 0) {
    return true;
  }

  // Check if user has permissions from Auth0
  const userPermissions = user.permissions || [];
  const userId = user.sub || 'unknown';

  // Check if the user has all required permissions
  const missingPermissions = requiredPermissions.filter(
    permission => !userPermissions.includes(permission)
  );

  const hasAllPermissions = missingPermissions.length === 0;

  if (hasAllPermissions) {
    // Log successful permission check
    logAuthorizationEvent('Permission check passed', SEVERITY_LEVELS.INFO, {
      userId,
      requiredPermissions
    });
  } else {
    // Log failed permission check
    logAuthorizationEvent('Permission check failed: Missing required permissions', SEVERITY_LEVELS.WARNING, {
      userId,
      requiredPermissions,
      missingPermissions,
      userPermissions
    });
  }

  return hasAllPermissions;
};

/**
 * Custom hook to check if the user has the required role
 * @param {string[]} requiredRoles - Array of roles required to access a resource
 * @returns {boolean} - True if the user has any of the required roles, false otherwise
 */
export const useHasRoles = (requiredRoles = []) => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading || !isAuthenticated || !user) {
    // Don't log during loading state, but log if authentication check fails
    if (!isLoading && (!isAuthenticated || !user)) {
      logAuthorizationEvent('Role check failed: User not authenticated', SEVERITY_LEVELS.WARNING, {
        requiredRoles,
        isAuthenticated,
        hasUser: !!user
      });
    }
    return false;
  }

  // If no roles are required, return true
  if (requiredRoles.length === 0) {
    return true;
  }

  // Check if user has roles from Auth0
  // Auth0 stores roles in the user object under the key specified in your Auth0 configuration
  const userRoles = user['https://nexuslarp.com/roles'] || [];
  const userId = user.sub || 'unknown';

  // Check if the user has any of the required roles
  const matchingRoles = requiredRoles.filter(role => userRoles.includes(role));
  const hasAnyRole = matchingRoles.length > 0;

  if (hasAnyRole) {
    // Log successful role check
    logAuthorizationEvent('Role check passed', SEVERITY_LEVELS.INFO, {
      userId,
      requiredRoles,
      matchingRoles
    });
  } else {
    // Log failed role check
    logAuthorizationEvent('Role check failed: Missing required roles', SEVERITY_LEVELS.WARNING, {
      userId,
      requiredRoles,
      userRoles
    });
  }

  return hasAnyRole;
};

/**
 * Utility function to map application roles to Auth0 roles
 * This helps maintain compatibility with the existing role system
 * @param {string} appRole - Application role (e.g., 'Wizard', 'HeadGM')
 * @returns {string} - Corresponding Auth0 role
 */
export const mapAppRoleToAuth0Role = (appRole) => {
  const roleMap = {
    'Wizard': 'admin',
    'HeadGM': 'head_gm',
    'SecondGM': 'gm',
    'Approver': 'approver',
    'Writer': 'writer',
    'Reader': 'reader'
  };

  return roleMap[appRole] || 'reader'; // Default to reader if role not found
};

export default { useHasPermissions, useHasRoles, mapAppRoleToAuth0Role };
