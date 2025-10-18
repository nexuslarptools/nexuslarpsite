import { useNavigate } from 'react-router-dom'
import './button.scss'

const LogoutButton = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    // Route to our SPA logout handler which will call the backend and clear client tokens
    const defaultRedirect = '/'
    navigate(`/oauth2/logout?redirect=${encodeURIComponent(defaultRedirect)}`)
  }

  return (
    <button className="button-basic" onClick={handleClick}>
      Log Out
    </button>
  )
}

export default LogoutButton
