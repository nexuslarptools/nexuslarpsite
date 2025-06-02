import PropTypes from 'prop-types';
import LoginButton from '../loginbuttons/loginbutton.jsx'
import LogoutButton from '../loginbuttons/logoutbutton.jsx'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import './header.scss'
import AuthLevelInfo from '../../utils/authLevelInfo.js'
import MenuIcon from '@mui/icons-material/Menu';
import { useEffect, useState } from 'react';
import { Tooltip } from '@mui/material';

const Header = props => {

  const [buttonactive, SetButtonActive] = useState(true);
      useEffect(() => {
        SetButtonActive(props.mainmenu);
      }, [props.mainmenu])

  const { user, isAuthenticated, isAuthLoading } = useAuth0()
  const authLevel = AuthLevelInfo();
    
      let navClasses = 'navbar-container';
      return (
        <header className={navClasses}>
        <nav className="navbar-navigation">
        <div className="navbar_logo" aria-label="Return Home">
{/*           { buttonactive ?
        <div className ='navbar_hamburger_button'>
          <Tooltip title="Search Menu">
             <button className='button-hambuger'   onClick={() => props.drawerOpenCLick(true)}>
          <MenuIcon sx={{fontSize: 35}} />
        </button>
        </Tooltip>
        </div> : <></>
         } */}
        <div>
        <Link to={{ pathname: '/' }}>Nexus DB
              <div className='logo-image-container'>
                <div className='logo-img rock' alt="Rock"></div>
                <div className='logo-img paper' alt="Paper"></div>
                <div className='logo-img scissors' alt="Scissors"></div>
              </div>
            </Link>
            </div>
          </div>
  <div className="navigation-items">
  <ul>
{/*   {authLevel > -2 ? <li><Link 
  to={{ pathname: '/' }}> Home </Link></li> : <></>} */}
  {authLevel > 3 ? <li><Link 
  to={{ pathname: '/users' }}> Users </Link></li> : <></>}
  {authLevel > 0 ? <li><Link 
  to={{ pathname: '/larps' }}> Larps </Link></li> : <></>}
  {authLevel > 1 ? <li><Link
  to={{ pathname: '/tags' }}> Tags </Link></li> : <></>}
  {authLevel > 0 ? <li> <Link 
  to={{ pathname: '/series' }}> Series </Link></li> : <></>}
  {authLevel > 0 ? <li><Link 
  to={{ pathname: '/items' }}> Items </Link></li> : <></>}
    {authLevel > 0 ? <li><Link 
  to={{ pathname: '/characters' }}> Characters </Link></li> : <></>}
  </ul>
  </div>
        <div className="nav-user-info">   
        {isAuthenticated && (
        <div className="profile">
           <Link 
  to={{ pathname: '/profile' }}> 
          {user.email}
          </Link>
        </div>
          )}
          {!isAuthenticated && !isAuthLoading && (
              <div className="login">
                <LoginButton/>
              </div>
                  )}
          {isAuthenticated && !isAuthLoading && (
              <div className="logout">
                <LogoutButton/>
              </div>
                  )} 
                  </div>
                  </nav>
          </header>
      )
}

export default Header

Header.propTypes = {
  drawerOpenCLick: PropTypes.func,
  mainmenu: PropTypes.bool
  }