import PropTypes from 'prop-types'
import AuthLevelInfo from '../../utils/authLevelInfo'
import SearchDrawer from './searchdrawer'

// Renders the SearchDrawer only when the user is authenticated
const SearchDrawerGate = (props) => {
  const authLevel = AuthLevelInfo();
  const isAuthenticated = authLevel > 0;
  const isLoading = authLevel === 0;

  if (isLoading || !isAuthenticated) return null;

  return (
    <SearchDrawer open={props.open} toggleClose={props.toggleClose} />
  );
}

SearchDrawerGate.propTypes = {
  open: PropTypes.bool,
  toggleClose: PropTypes.func,
};

export default SearchDrawerGate
