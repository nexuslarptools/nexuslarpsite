import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from '../loading/loading'
import PropTypes from 'prop-types'
import { useEffect, useState } from "react";

export const AuthenticationGuard = (props) => {
  const Component = withAuthenticationRequired(props.component, {
    onRedirecting: () => (
      <div className="page-layout">
        <Loading />
      </div>
    ),
  });

  const [currentState, SetCurrentState] = useState(null)

  useEffect(() => {
    if (currentState !== props.subState){
      SetCurrentState(props.subState)
    }
  }, [])

  return <Component subState={props.subState} toggleSubScreen={(e, funct, guid, path) => props.toggleSubScreen(e, funct, guid, path)}/>;
};

export default AuthenticationGuard;

AuthenticationGuard.propTypes = {
    component: PropTypes.func,
    toggleSubScreen: PropTypes.func,
    subState: PropTypes.object
}
