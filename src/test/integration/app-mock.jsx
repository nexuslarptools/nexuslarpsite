import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { mockApiResponses, mockApiGet, mockApiPut, mockApiPost } from './api-mock';
import { act } from '@testing-library/react';
import { apiPut } from '../../utils/apiPut';

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
  const [currentView, setCurrentView] = useState('home');
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Profile state
  const [isEditing, setIsEditing] = useState(false);
  const [preferredName, setPreferredName] = useState('John Doe');
  const [email, setEmail] = useState('john.doe@example.com');
  const [profileError, setProfileError] = useState(null);

  // Mock search function
  const handleSearch = async () => {
    try {
      act(() => {
        setIsLoading(true);
        setError(null);
      });

      // Call the API with the search query
      const results = await mockApiGet(
        { getAccessTokenSilently: () => Promise.resolve('mock-token') },
        `/api/v1/Search?q=${searchQuery}`
      );

      act(() => setSearchResults(results));
    } catch (err) {
      act(() => setError(err.message));
    } finally {
      act(() => setIsLoading(false));
    }
  };

  // Mock user menu for tests that need to click on it
  const renderUserMenu = () => {
    if (isAuthenticated && user) {
      return (
        <div className="user-menu">
          <span>{user.name}</span>
          <div className="dropdown-menu">
            <button onClick={() => act(() => setCurrentView('profile'))}>Profile</button>
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
      <div className="logo" onClick={() => act(() => setCurrentView('home'))}>
        <img src="mock-logo.png" alt="Nexus Logo" />
      </div>
      <ul>
        <li><button onClick={() => act(() => setCurrentView('home'))}>Home</button></li>
        <li><button onClick={() => act(() => setCurrentView('items'))}>Items</button></li>
        <li><button onClick={() => act(() => setCurrentView('characters'))}>Characters</button></li>
        <li><button onClick={() => act(() => setCurrentView('series'))}>Series</button></li>
        <li><button onClick={() => act(() => setCurrentView('tags'))}>Tags</button></li>
        <li><button onClick={() => act(() => setCurrentView('larps'))}>Larps</button></li>
      </ul>
      <div className="search">
        <button aria-label="Search" onClick={() => act(() => setIsSearchOpen(true))}>Search</button>
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
          <button onClick={() => act(() => setIsSearchOpen(false))}>Close</button>
        </div>
        <div className="search-form">
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery} 
            onChange={(e) => act(() => setSearchQuery(e.target.value))} 
          />
          <button aria-label="Submit Search" onClick={handleSearch}>Search</button>
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
                    <li key={character.id} onClick={() => {
                      act(() => {
                        setSelectedCharacter(character);
                        setCurrentView('character-details');
                        setIsSearchOpen(false);
                      });
                    }}>
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

  // Handle saving profile changes
  const handleSaveProfile = async () => {
    try {
      act(() => setProfileError(null));

      // Call the API to update the user profile
      await apiPut(
        { getAccessTokenSilently: () => Promise.resolve('mock-token') },
        '/api/v1/Users/Current',
        { preferredname: preferredName, email }
      );

      // Exit edit mode
      act(() => setIsEditing(false));
    } catch (err) {
      act(() => setProfileError(err.message || 'Failed to update profile'));
    }
  };

  // Mock profile view
  const renderProfileView = () => {
    return (
      <div className="profile-view">
        <h1>User Profile</h1>
        {profileError && <div className="error">{profileError}</div>}
        <div className="profile-form">
          <div className="form-group">
            <label htmlFor="preferredName">Preferred Name</label>
            <input 
              id="preferredName"
              type="text" 
              value={preferredName}
              onChange={(e) => act(() => setPreferredName(e.target.value))}
              readOnly={!isEditing}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => act(() => setEmail(e.target.value))}
              readOnly={!isEditing}
            />
          </div>
          {isEditing ? (
            <button onClick={handleSaveProfile}>Save</button>
          ) : (
            <button onClick={() => act(() => setIsEditing(true))}>Edit</button>
          )}
        </div>
      </div>
    );
  };

  // Mock character details view
  const renderCharacterDetailsView = () => {
    if (!selectedCharacter) return null;

    return (
      <div className="character-details">
        <h1>Character Details</h1>
        <h2>{selectedCharacter.name}</h2>
        <p>{selectedCharacter.description}</p>
      </div>
    );
  };

  // Mock series view
  const renderSeriesView = () => {
    return (
      <div className="series-view">
        <h1>Series List</h1>
        <p>This is a mock series collection for testing purposes.</p>
      </div>
    );
  };

  // Items state
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemError, setItemError] = useState(null);

  // Handle saving item changes
  const handleSaveItem = async () => {
    try {
      act(() => setItemError(null));

      // Call the API to update the item
      await mockApiPut(
        { getAccessTokenSilently: () => Promise.resolve('mock-token') },
        `/api/v1/Items/${selectedItem.id}`,
        { name: itemName, description: itemDescription }
      );

      // Exit edit mode and go back to items list
      act(() => {
        setIsEditingItem(false);
        setSelectedItem(null);
        setCurrentView('items');
      });
    } catch (err) {
      act(() => setItemError(err.message || 'Failed to update item'));
    }
  };

  // Handle creating a new item
  const handleCreateItem = async () => {
    try {
      act(() => setItemError(null));

      // Call the API to create the item
      await mockApiPost(
        { getAccessTokenSilently: () => Promise.resolve('mock-token') },
        '/api/v1/Items',
        { name: itemName, description: itemDescription }
      );

      // Go back to items list
      act(() => setCurrentView('items'));
    } catch (err) {
      act(() => setItemError(err.message || 'Failed to create item'));
    }
  };

  // Mock items view
  const renderItemsView = () => {

    return (
      <div className="items-view">
        <h1>Item Management</h1>
        <button onClick={() => {
          act(() => {
            setItemName('');
            setItemDescription('');
            setSelectedItem(null);
            setCurrentView('item-new');
          });
        }}>New Item</button>
        <div className="items-list">
          {mockApiResponses['/api/v1/Items'].items.map(item => (
            <div key={item.id} className="item-card">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="item-actions">
                <button onClick={() => {
                  act(() => {
                    setSelectedItem(item);
                    setCurrentView('item-details');
                  });
                }}>View</button>
                <button onClick={() => {
                  act(() => {
                    setSelectedItem(item);
                    setItemName(item.name);
                    setItemDescription(item.description);
                    setIsEditingItem(true);
                    setCurrentView('item-edit');
                  });
                }}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Mock item details view
  const renderItemDetailsView = () => {
    if (!selectedItem) return null;

    return (
      <div className="item-details">
        <h1>Item Details</h1>
        <h2>{selectedItem.name}</h2>
        <p>{selectedItem.description}</p>
        <button onClick={() => act(() => setCurrentView('items'))}>Back to Items</button>
      </div>
    );
  };

  // Mock item edit view
  const renderItemEditView = () => {
    if (!selectedItem) return null;

    return (
      <div className="item-edit">
        <h1>Edit Item</h1>
        {itemError && <div className="error">{itemError}</div>}
        <div className="item-form">
          <div className="form-group">
            <label htmlFor="itemName">Name</label>
            <input 
              id="itemName"
              type="text" 
              value={itemName}
              onChange={(e) => act(() => setItemName(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemDescription">Description</label>
            <textarea 
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => act(() => setItemDescription(e.target.value))}
            />
          </div>
          <button onClick={handleSaveItem}>Save</button>
          <button onClick={() => {
            act(() => {
              setIsEditingItem(false);
              setCurrentView('items');
            });
          }}>Cancel</button>
        </div>
      </div>
    );
  };

  // Mock new item view
  const renderNewItemView = () => {
    return (
      <div className="item-new">
        <h1>New Item</h1>
        {itemError && <div className="error">{itemError}</div>}
        <div className="item-form">
          <div className="form-group">
            <label htmlFor="itemName">Name</label>
            <input 
              id="itemName"
              type="text" 
              value={itemName}
              onChange={(e) => act(() => setItemName(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="itemDescription">Description</label>
            <textarea 
              id="itemDescription"
              value={itemDescription}
              onChange={(e) => act(() => setItemDescription(e.target.value))}
            />
          </div>
          <button onClick={handleCreateItem}>Save</button>
          <button onClick={() => act(() => setCurrentView('items'))}>Cancel</button>
        </div>
      </div>
    );
  };

  // Mock characters view
  const renderCharactersView = () => {
    return (
      <div className="characters-view">
        <h1>Character Management</h1>
        <p>This is a mock characters list for testing purposes.</p>
      </div>
    );
  };

  // Render the appropriate view based on currentView state
  const renderCurrentView = () => {
    if (currentView === 'profile') {
      return renderProfileView();
    }

    if (currentView === 'character-details') {
      return renderCharacterDetailsView();
    }

    if (currentView === 'series') {
      return renderSeriesView();
    }

    if (currentView === 'items') {
      return renderItemsView();
    }

    if (currentView === 'item-details') {
      return renderItemDetailsView();
    }

    if (currentView === 'item-edit') {
      return renderItemEditView();
    }

    if (currentView === 'item-new') {
      return renderNewItemView();
    }

    if (currentView === 'characters') {
      return renderCharactersView();
    }

    // Default to home view
    return (
      <div>
        <h1>Welcome to Nexus</h1>
        <p>This is a mock app for testing purposes.</p>
      </div>
    );
  };

  return (
    <div className="app">
      {renderNavigation()}
      {renderSearchDrawer()}
      <div className="app-body">
        {/* Render children if provided, otherwise render the current view */}
        {props.children || renderCurrentView()}
      </div>
    </div>
  );
};

export default MockApp;
