import './App.scss'
import './master.scss';
import { Component } from "react"
import { Route, Routes, BrowserRouter } from "react-router-dom"
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


class App extends Component {

  state = {
    open: false,
    currentURL: window.location.href 
  }

  togglePreview = (e) => {
    this.setState({open: e});
    return {open: e};
  };

  render() {
    return (
      <BrowserRouter>
      <div className="app">
      <Header drawerOpenCLick={(e) => this.togglePreview(e)} />
      <div className={"app-body"}>
          <Routes>
          <Route exact path="/" element={<HomePage />}>
          </Route>
            <Route
            path="/profile"
            element={<AuthenticationGuard component={CurrentUserPage} />}
           />
            <Route
            path="/users"
            element={<AuthenticationGuard component={UsersPage} />}
           />
            <Route
            path="/items"
            element={<AuthenticationGuard component={ItemsIndex} />}
           />
            <Route
            path="/characters"
            element={<AuthenticationGuard component={CharactersIndex} />}
           />
          <Route
            path="/series"
            element={<AuthenticationGuard component={SeriesIndex} />}
           />
          <Route
            path="/tags"
            element={<AuthenticationGuard component={TagsIndex} />}
           />
          <Route
            path="/larps"
            element={<AuthenticationGuard component={LarpsIndex} />}
           />
          <Route
            path="/contactus"
            element={<AuthenticationGuard component={ContactUs} />}
           />
          <Route path="*" element={<HomePage />}
                />
          </Routes>
          </div>
          </div>
          <ContactFooter/>
        </BrowserRouter>
    );
  }
}

export default App;