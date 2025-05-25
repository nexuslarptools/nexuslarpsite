import PropTypes from 'prop-types'
import logo from '../assets/rose2.png'
import './Home.scss'
import { useEffect } from 'react';

export default function HomePage(props) {

  console.log('props obj:', props);

      useEffect(() => {
        props.toggleSubScreen(true)
      }, [])

  return (
    <>
            <div className="App-header">
            <div className="logobody">
          <img src={logo} className="App-logo" alt="logo" style={{ zIndex: '2' }} />
          </div>
        </div>
        </>
  )
}

HomePage.propTypes = {
  toggleSubScreen: PropTypes.func
}
