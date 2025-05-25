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



class App extends Component {

  state = {
    open: false,
    ismain: true,
    funct: '',
    guid: '',
    path: '',
    currentURL: window.location.href 
  }

  ismain = true;

  togglePreview = (e) => {
    this.setState({open: e});
    return {open: e};
  };

  toggleSubScreen = async (e, funct, guid, path) => {
    await this.setState(
      {ismain: e,
        funct: funct,
        guid: guid,
        path: path
      });
  };

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
            element={<AuthenticationGuard toggleSubScreen={(e) => this.toggleSubScreen(e)}component={ItemsIndex} />}
           />
            <Route
            path="/characters"
            element={(<AuthenticationGuard subState={this.state} toggleSubScreen={(e, funct, guid, path) => this.toggleSubScreen(e, funct, guid, path)} component={CharactersIndex} />)}
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
            element={<AuthenticationGuard subState={this.state} toggleSubScreen={(e) => this.toggleSubScreen(e)} component={CharacterSearch} />}
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