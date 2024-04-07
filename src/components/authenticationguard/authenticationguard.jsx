import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Loading } from '../loading/loading'
import PropTypes from 'prop-types'

export const AuthenticationGuard = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div className="page-layout">
        <Loading />
      </div>
    ),
  });

  return <Component />;
};

export default AuthenticationGuard;

AuthenticationGuard.propTypes = {
    component: PropTypes.func
}
