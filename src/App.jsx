import './App.scss'
import './master.scss';
import { Route, BrowserRouter } from "react-router-dom"
import Header from "./components/header/header"
import HomePage from "./views/HomePage"
import CurrentUserPage from "./views/Users/CurrentUserPage"
import ItemsIndex from "./views/Items/ItemsIndex"
import UsersPage from "./views/Users/UserList"
import SeriesIndex from "./views/Series/SeriesIndex"
import AuthenticationGuard from './components/authenticationguard/authenticationguard'
import TagsIndex from './views/Tags/TagsIndex'
import LarpsIndex from './views/Larps/LarpsIndex'
import ContactFooter from './components/contactfooter/contactbar';
import ContactUs from './views/EmailHelp/EmailHelp';
import CharactersIndex from './views/Characters/CharactersIndex';
import { FaroRoutes } from '@grafana/faro-react';
import SearchDrawer from './components/drawer/searchdrawer';
import CharacterSearch from './views/Search/charactersearch';
// Import Zustand stores
import { useUIStore, useCharactersStore, useItemsStore } from './store';

const App = () => {
  // UI store selectors
  const isDrawerOpen = useUIStore((state) => state.isDrawerOpen);
  const isMainScreen = useUIStore((state) => state.isMainScreen);
  const currentFunction = useUIStore((state) => state.currentFunction);
  const currentGuid = useUIStore((state) => state.currentGuid);
  const currentPath = useUIStore((state) => state.currentPath);

  // UI store actions
  const toggleDrawer = useUIStore((state) => state.toggleDrawer);
  const setNavigation = useUIStore((state) => state.setNavigation);

  // Characters store selectors and actions
  const charactersState = useCharactersStore((state) => ({
    filter: state.filter,
    selectedApproved: state.selectedApproved,
    commentFilter: state.commentFilter,
    showApprovableOnly: state.showApprovableOnly,
    readyApproved: state.readyApproved,
    viewingItem: state.viewingItem,
    editingItem: state.editingItem,
    viewItemGuid: state.viewItemGuid,
    viewItemPath: state.viewItemPath
  }));
  const setCharactersFilter = useCharactersStore((state) => state.setFilter);
  const toggleCharactersViewOption = useCharactersStore((state) => state.toggleViewOption);

  // Items store selectors and actions
  const itemsState = useItemsStore((state) => ({
    filter: state.filter,
    selectedApproved: state.selectedApproved,
    commentFilter: state.commentFilter,
    showApprovableOnly: state.showApprovableOnly,
    readyApproved: state.readyApproved,
    viewingItem: state.viewingItem,
    editingItem: state.editingItem,
    viewItemGuid: state.viewItemGuid,
    viewItemPath: state.viewItemPath
  }));
  const setItemsFilter = useItemsStore((state) => state.setFilter);
  const toggleItemsViewOption = useItemsStore((state) => state.toggleViewOption);

  // Compatibility functions to maintain the same API for components
  const toggleSwitch = async (e, type) => {
    if (type === 'characters') {
      toggleCharactersViewOption(e);
    } else if (type === 'items') {
      toggleItemsViewOption(e);
    }
  };

  const toggleSwitches = async (e, type) => {
    for (const key of Object.keys(e)) {
      await toggleSwitch(key, type);
    }
  };

  const togglePreview = (e) => {
    toggleDrawer(e);
    return { open: e };
  };

  const toggleSubScreen = async (e, funct, guid, path, type, filters) => {
    // Update UI navigation state
    setNavigation(e, funct, guid, path);

    // Update type-specific state
    if (type === 'characters') {
      if (filters !== 'goback' && filters) {
        setCharactersFilter(filters);
      }

      if (funct === 'View') {
        useCharactersStore.getState().viewCharacter(guid, path);
      } else if (funct === 'Edit') {
        useCharactersStore.getState().editCharacter(guid, path);
      } else if (e === true) {
        useCharactersStore.getState().resetView();
      }
    } else if (type === 'items') {
      if (filters !== 'goback' && filters) {
        setItemsFilter(filters);
      }

      if (funct === 'View') {
        useItemsStore.getState().viewItem(guid, path);
      } else if (funct === 'Edit') {
        useItemsStore.getState().editItem(guid, path);
      } else if (e === true) {
        useItemsStore.getState().resetView();
      }
    }
  };

  return (
    <BrowserRouter>
      <SearchDrawer open={isDrawerOpen} toggleClose={() => togglePreview(false)} />
      <div className="app">
        <Header drawerOpenCLick={(e) => togglePreview(e)} mainmenu={isMainScreen} />
        <div className={"app-body"}>
          <FaroRoutes>
            <Route
              exact path="/"
              element={(<HomePage 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
              />)}
            />
            <Route
              path="/profile"
              element={<AuthenticationGuard 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
                component={CurrentUserPage} 
              />}
            />
            <Route
              path="/users"
              element={<AuthenticationGuard 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
                component={UsersPage} 
              />}
            />
            <Route
              path="/items"
              element={<AuthenticationGuard
                subState={itemsState}
                ismain={isMainScreen}
                ToggleSwitches={(e) => toggleSwitches(e, 'items')}
                toggleSubScreen={(e, funct, guid, path, filters) => toggleSubScreen(e, funct, guid, path, 'items', filters)}
                component={ItemsIndex} />}
            />
            <Route
              path="/characters"
              element={(<AuthenticationGuard
                subState={charactersState}
                ismain={isMainScreen}
                ToggleSwitches={(e) => toggleSwitches(e, 'characters')}
                toggleSubScreen={(e, funct, guid, path, filters) => toggleSubScreen(e, funct, guid, path, 'characters', filters)}
                component={CharactersIndex} />)}
            />
            <Route
              path="/series"
              element={<AuthenticationGuard 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
                component={SeriesIndex} 
              />}
            />
            <Route
              path="/tags"
              element={<AuthenticationGuard 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
                component={TagsIndex} 
              />}
            />
            <Route
              path="/larps"
              element={<AuthenticationGuard 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
                component={LarpsIndex} 
              />}
            />
            <Route
              path="/contactus"
              element={<AuthenticationGuard 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
                component={ContactUs} 
              />}
            />
            <Route
              path="/charactersearch/"
              element={<AuthenticationGuard
                subState={charactersState}
                ismain={isMainScreen}
                ToggleSwitches={(e) => toggleSwitches(e, 'characters')}
                toggleSubScreen={(e, funct, guid, path, filters) => toggleSubScreen(e, funct, guid, path, 'characters', filters)}
                component={CharacterSearch} />}
            />
            <Route
              path="*"
              element={(<HomePage 
                subState={{ 
                  ismain: isMainScreen, 
                  funct: currentFunction, 
                  guid: currentGuid, 
                  path: currentPath 
                }} 
                toggleSubScreen={(e) => toggleSubScreen(e)} 
              />)}
            />
          </FaroRoutes>
        </div>
      </div>
      <ContactFooter />
    </BrowserRouter>
  );
};

export default App;
