import { Loading } from '../loading/loading'
import PropTypes from 'prop-types'
import { useEffect, useMemo, useState } from "react";
import AuthLevelInfo from '../../utils/authLevelInfo'
import LoginButton from '../loginbuttons/loginbutton'

export const AuthenticationGuard = (props) => {
  const Component = props.component;

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
    return (
      <div className="page-layout" style={{ padding: 24 }}>
        <p>You need to log in to view this page.</p>
        <LoginButton />
      </div>
    );
  }

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
