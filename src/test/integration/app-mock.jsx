import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

/**
 * A very simple mock App component for testing
 * This avoids routing issues by not including any actual routes
 */
export const MockApp = (props) => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mock search function
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Import the apiGet function
      const { apiGet } = await import('../../utils/apiGet');

      // Call the API with the search query
      const results = await apiGet(
        { getAccessTokenSilently: () => Promise.resolve('mock-token') },
        `/api/v1/Search?q=${searchQuery}`
      );

      setSearchResults(results);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock user menu for tests that need to click on it
  const renderUserMenu = () => {
    if (isAuthenticated && user) {
      return (
        <div className="user-menu">
          <span>{user.name}</span>
          <div className="dropdown-menu">
            <button onClick={() => {}}>Profile</button>
            <button onClick={logout}>Log Out</button>
          </div>
        </div>
      );
    }
    return <button onClick={loginWithRedirect}>Log In</button>;
  };

  // Mock navigation for tests that need to click on links
  const renderNavigation = () => (
    <nav>
      <div className="logo">
        <img src="mock-logo.png" alt="Nexus Logo" />
      </div>
      <ul>
        <li><button>Home</button></li>
        <li><button>Items</button></li>
        <li><button>Characters</button></li>
        <li><button>Series</button></li>
        <li><button>Tags</button></li>
        <li><button>Larps</button></li>
      </ul>
      <div className="search">
        <button aria-label="Search" onClick={() => setIsSearchOpen(true)}>Search</button>
      </div>
      {renderUserMenu()}
    </nav>
  );

  // Mock search drawer
  const renderSearchDrawer = () => {
    if (!isSearchOpen) return null;

    return (
      <div className="search-drawer">
        <div className="search-header">
          <h2>Search</h2>
          <button onClick={() => setIsSearchOpen(false)}>Close</button>
        </div>
        <div className="search-form">
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {isLoading && <div className="loading">Loading...</div>}
        {error && <div className="error">{error}</div>}
        {searchResults && (
          <div className="search-results">
            {searchResults.characters && searchResults.characters.length > 0 ? (
              <div className="character-results">
                <h3>Characters</h3>
                <ul>
                  {searchResults.characters.map(character => (
                    <li key={character.id} onClick={() => {}}>
                      {character.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {searchResults.items && searchResults.items.length > 0 ? (
              <div className="item-results">
                <h3>Items</h3>
                <ul>
                  {searchResults.items.map(item => (
                    <li key={item.id} onClick={() => {}}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {(!searchResults.characters || searchResults.characters.length === 0) && 
             (!searchResults.items || searchResults.items.length === 0) && (
              <div className="no-results">
                <p>No results found</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      {renderNavigation()}
      {renderSearchDrawer()}
      <div className="app-body">
        {/* Just render the children or a welcome message */}
        {props.children || (
          <div>
            <h1>Welcome to Nexus</h1>
            <p>This is a mock app for testing purposes.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockApp;
