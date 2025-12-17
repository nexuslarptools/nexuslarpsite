import { Loading } from '../loading/loading'
import PropTypes from 'prop-types'
import { useEffect, useState } from "react";
import AuthLevelInfo from '../../utils/authLevelInfo'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export const AuthenticationGuard = (props) => {
  const Component = props.component;
  const location = useLocation();
  const navigate = useNavigate();

  const [currentState, SetCurrentState] = useState(null)
  const authLevel = AuthLevelInfo();
  const isAuthenticated = authLevel > 0;
  const isLoading = authLevel === 0;

  useEffect(() => {
    if (currentState !== props.subState){
      SetCurrentState(props.subState)
    }
  }, [])

  if (isLoading) {
    return (
      <div className="page-layout">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not authenticated: redirect to /login, preserving where the user came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated and we have a stored returnTo (set by /login), redirect once.
  useEffect(() => {
    if (isAuthenticated) {
      let stored = null;
      try { stored = sessionStorage.getItem('returnTo'); } catch {}
      if (stored) {
        try { sessionStorage.removeItem('returnTo'); } catch {}
        const current = `${location.pathname}${location.search}${location.hash}`;
        if (stored !== current) {
          navigate(stored, { replace: true });
        }
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return <Component subState={props.subState} ismain={props.ismain}  
  toggleSubScreen={(e, funct, guid, path, filters) => props.toggleSubScreen(e, funct, guid, path, filters)}
  ToggleSwitch={(e) => props.ToggleSwitch(e)}
  ToggleSwitches={(e) => props.ToggleSwitches(e)}
  UpdateItemsList={(e) => props.UpdateItemsList(e)}
  />;
};

export default AuthenticationGuard;

AuthenticationGuard.propTypes = {
    component: PropTypes.func,
    toggleSubScreen: PropTypes.func,
    subState: PropTypes.object,
    ismain:PropTypes.bool,
    ToggleSwitch:PropTypes.func,
    ToggleSwitches:PropTypes.func,
    UpdateItemsList:PropTypes.func
}
