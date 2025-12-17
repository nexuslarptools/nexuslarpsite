import { Loading } from '../loading/loading'
import PropTypes from 'prop-types'
import { useEffect, useState } from "react";
import AuthLevelInfo from '../../utils/authLevelInfo'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'

export const AuthenticationGuard = (props) => {
  const Component = props.component;
  const location = useLocation();
  const navigate = useNavigate();

  const authLevel = AuthLevelInfo();
  const isAuthenticated = authLevel > 0;
  const isLoading = authLevel === 0;

  useEffect(() => {
    if (!isAuthenticated) return;

    let stored = null;
    try { stored = sessionStorage.getItem("returnTo"); } catch {}

    if (!stored) return;

    // Optional safety: only allow internal paths
    if (typeof stored !== "string" || !stored.startsWith("/")) {
      try { sessionStorage.removeItem("returnTo"); } catch {}
      return;
    }

    try { sessionStorage.removeItem("returnTo"); } catch {}

    const current = `${location.pathname}${location.search}${location.hash}`;
    if (stored !== current) {
      navigate(stored, { replace: true });
    }
  }, [isAuthenticated, location.pathname, location.search, location.hash, navigate]);

  if (isLoading) {
    return (
      <div className="page-layout">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <Component
      subState={props.subState}
      ismain={props.ismain}
      toggleSubScreen={props.toggleSubScreen}
      ToggleSwitch={props.ToggleSwitch}
      ToggleSwitches={props.ToggleSwitches}
      UpdateItemsList={props.UpdateItemsList}
    />
  );
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
