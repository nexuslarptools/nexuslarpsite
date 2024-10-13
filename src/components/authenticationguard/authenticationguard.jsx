import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from '../loading/loading'
import PropTypes from 'prop-types'

export const AuthenticationGuard = (props) => {
  const Component = withAuthenticationRequired(props.component, {
    onRedirecting: () => (
      <div className="page-layout">
        <Loading />
      </div>
    ),
  });

  return <Component toggleSubScreen={(e) => props.toggleSubScreen(e)}/>;
};

export default AuthenticationGuard;

AuthenticationGuard.propTypes = {
    component: PropTypes.func,
    toggleSubScreen: PropTypes.func,
}
