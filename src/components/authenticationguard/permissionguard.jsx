import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from '../loading/loading';
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import { useHasPermissions, useHasRoles, mapAppRoleToAuth0Role } from "../../utils/checkPermissions";
import { Navigate } from "react-router-dom";

/**
 * A component that guards routes based on authentication and permissions
 * @param {Object} props - Component props
 * @param {Function} props.component - The component to render if authenticated and authorized
 * @param {Object} props.subState - State to pass to the component
 * @param {boolean} props.ismain - Whether this is the main screen
 * @param {Function} props.toggleSubScreen - Function to toggle sub screen
 * @param {Function} props.ToggleSwitch - Function to toggle switch
 * @param {Function} props.ToggleSwitches - Function to toggle multiple switches
 * @param {string[]} props.requiredPermissions - Permissions required to access this route
 * @param {string[]} props.requiredRoles - Roles required to access this route
 * @param {string} props.fallbackPath - Path to redirect to if not authorized (default: '/')
 * @returns {JSX.Element} - The protected component or a redirect
 */
export const PermissionGuard = (props) => {
  const { 
    component, 
    subState, 
    ismain, 
    toggleSubScreen, 
    ToggleSwitch, 
    ToggleSwitches,
    requiredPermissions = [],
    requiredRoles = [],
    fallbackPath = '/'
  } = props;

  // Initialize state at the top of the component
  const [currentState, SetCurrentState] = useState(null);

  // Effect to update currentState when subState changes
  useEffect(() => {
    if (currentState !== subState) {
      SetCurrentState(subState);
    }
  }, [currentState, subState]);

  // Convert application roles to Auth0 roles if provided
  const auth0Roles = requiredRoles.map(role => mapAppRoleToAuth0Role(role));

  // Check if user has required permissions and roles
  const hasPermissions = useHasPermissions(requiredPermissions);
  const hasRoles = useHasRoles(auth0Roles);

  // User is authorized if they have all required permissions AND any of the required roles
  const isAuthorized = hasPermissions && hasRoles;

  // If not authorized, redirect to fallback path
  if (!isAuthorized) {
    return <Navigate to={fallbackPath} replace />;
  }

  // If authorized, wrap the component with authentication check
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <Loading />
      </div>
    ),
  });

  return (
    <Component 
      subState={subState} 
      ismain={ismain}  
      toggleSubScreen={(e, funct, guid, path, filters) => toggleSubScreen(e, funct, guid, path, filters)}
      ToggleSwitch={(e) => ToggleSwitch && ToggleSwitch(e)}
      ToggleSwitches={(e) => ToggleSwitches && ToggleSwitches(e)}
    />
  );
};

export default PermissionGuard;

PermissionGuard.propTypes = {
  component: PropTypes.func.isRequired,
  toggleSubScreen: PropTypes.func,
  subState: PropTypes.object,
  ismain: PropTypes.bool,
  ToggleSwitch: PropTypes.func,
  ToggleSwitches: PropTypes.func,
  requiredPermissions: PropTypes.arrayOf(PropTypes.string),
  requiredRoles: PropTypes.arrayOf(PropTypes.string),
  fallbackPath: PropTypes.string
};
