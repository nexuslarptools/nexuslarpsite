import './App.scss'
import './master.scss';
import { Component } from "react"
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
import ItemSearch from './views/Search/itemsearch';
import ShipItem from './components/item/shipitem';



class App extends Component {

  state = {
    open: false,
    ismain: true,
    funct: '',
    guid: '',
    path: '',
    characters: {
      filter:       {
        SeriesFilter: '',
        CharacterFilter: '',
        CreatorFilter: '',
        EditorFilter: '',
        SelectedApproval : '',
        LarpAutoCompValue: '',
        SelectedLarpTag: '',
        TagSelectValues: []
      },
      selectedApproved: true,
      commentFilter: false,
      showApprovableOnly: false,
      readyApproved: false,
      viewingItem: false,
      editingItem: false,
      viewItemGuid: '',
      viewItemPath: '',
    },
    items: {
      filter:       {
        SeriesFilter: '',
        ItemsFilter: '',
        CreatorFilter: '',
        EditorFilter: '',
        SelectedApproval : '',
        LarpAutoCompValue: '',
        SelectedLarpTag: '',
        TagSelectValues: []
      },
      selectedApproved: true,
      commentFilter: false,
      showApprovableOnly: false,
      readyApproved: false,
      viewingItem: false,
      editingItem: false,
      viewItemGuid: '',
      viewItemPath: '',
      listItems:[]
    },
    currentURL: window.location.href 
  }

  ismain = true;

  ToggleSwitch = async (e, type) => {
    let newstate =this.state[type]
    if (newstate === undefined)
      {
        newstate = { e: true };
      }
      else {
        newstate[e] = !newstate[e]
      }
    this.setState({
    ...this.state,
    [type] :newstate
    });
  }

  ToggleSwitches = async (e, type) => {
    for (const key of Object.keys(e)) {
      await this.ToggleSwitch(key, type);
    }
  }

  togglePreview = (e) => {
    this.setState({open: e});
    return {open: e};
  };

  toggleSubScreen = async (e, funct, guid, path, type, filters) => {
    let newstate =this.state

    newstate.ismain=e;
    newstate.funct=funct;
    newstate.guid=guid;
    newstate.path=path;
    if (newstate[type] === undefined)
    {
      newstate[type] = {};
    }

    newstate[type].funct=funct;
    newstate[type].guid=guid;
    newstate[type].path=path;

    if (filters !== 'goback') {
      newstate[type].filter = filters;
    } 
    else {
      newstate[type].filter = this.state[type].filter;
    }

    await this.setState(newstate);
  };

  UpdateItemsList = async (e) => {
    this.setState({
      ...this.state,
      items:{
      ...this.state.items, 
      listItems:e}
      });
  }


  render() {
    return (
      <BrowserRouter>
       <SearchDrawer open={this.state.open} toggleClose={() => this.togglePreview(false)} />
      <div className="app">
      <Header drawerOpenCLick={(e) => this.togglePreview(e)} mainmenu={this.state.ismain}/>
      <div className={"app-body"}>
          <FaroRoutes>

          <Route 
          exact path="/" 
          element={(<HomePage subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} />)} 
          />
            <Route
            path="/profile"
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={CurrentUserPage} />}
           />
            <Route
            path="/users"
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={UsersPage} />}
           />
            <Route
            path="/items"
            element={<AuthenticationGuard 
              subState={this.state.items !== undefined && this.state.items !== null ?this.state.items : this.state}
              ismain={this.state.ismain}
              ToggleSwitches={(e) => this.ToggleSwitches(e, 'items')}
              UpdateItemsList={(e) => this.UpdateItemsList(e)}
              toggleSubScreen={(e, funct, guid, path, filters) => this.toggleSubScreen(e, funct, guid, path, 'items', filters)} 
              component={ItemsIndex} />}
           />
            <Route
            path="/characters"
            element={(<AuthenticationGuard 
              subState={this.state.characters !== undefined && this.state.characters !== null ? this.state.characters : this.state}
              ismain={this.state.ismain}
              ToggleSwitches={(e) => this.ToggleSwitches(e, 'characters')}
              toggleSubScreen={(e, funct, guid, path, filters) => this.toggleSubScreen(e, funct, guid, path, 'characters', filters)} 
              component={CharactersIndex} />)}
           />
          <Route
            path="/series"
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={SeriesIndex} />}
           />
          <Route
            path="/tags"
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={TagsIndex} />}
           />
          <Route
            path="/larps"
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={LarpsIndex} />}
           />
          <Route

            path="/contactus"
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={ContactUs} />}
           />
          <Route
            path="/charactersearch/"
            element={<AuthenticationGuard 
              subState={this.state.characters !== undefined && this.state.characters !== null ?this.state.characters : this.state}
              ismain={this.state.ismain}
              ToggleSwitches={(e) => this.ToggleSwitches(e, 'characters')}
              toggleSubScreen={(e, funct, guid, path, filters) => this.toggleSubScreen(e, funct, guid, path, 'characters', filters)} 
              component={CharacterSearch} />}
           />
                     <Route
            path="/itemsearch/"
            element={<AuthenticationGuard 
              subState={this.state.items !== undefined && this.state.items !== null ?this.state.items : this.state}
              ismain={this.state.ismain}
              ToggleSwitches={(e) => this.ToggleSwitches(e, 'items')}
              UpdateItemsList={(e) => this.UpdateItemsList(e)}
              toggleSubScreen={(e, funct, guid, path, filters) => this.toggleSubScreen(e, funct, guid, path, 'items', filters)} 
              component={ItemSearch}/>}
           />
           <Route path="shiptest" 
           element={<AuthenticationGuard 
             component={ShipItem}
           />}
           />
          <Route 
          path="*"  
          element={(<HomePage subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} />)} 
          />
          </FaroRoutes>
          </div>
          </div>
          <ContactFooter/>
        </BrowserRouter>
    );
  }
}

export default App;