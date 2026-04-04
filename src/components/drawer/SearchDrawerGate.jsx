import PropTypes from 'prop-types'
import AuthLevelInfo from '../../utils/authLevelInfo'
import SearchDrawer from './searchdrawer'
import { useContext } from 'react';
import { SiteContext } from '../../contexts.jsx'

// Renders the SearchDrawer only when the user is authenticated
const SearchDrawerGate = (props) => {

const { site, setSite } = useContext(SiteContext);

  const authLevel = AuthLevelInfo();
  const isAuthenticated = authLevel > 0;
  const isLoading = authLevel === 0;

  const toggleClose = async () => {
    let openclose = !site.open;
      setSite({
        ...site,
        open :openclose
       });
    } 

  if (isLoading || !isAuthenticated) return null;


  return (
    <SearchDrawer open={site.open} toggleClose={() => toggleClose()} />
  );
}

SearchDrawerGate.propTypes = {
  open: PropTypes.bool,
  toggleClose: PropTypes.func,
};

export default SearchDrawerGate
