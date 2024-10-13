import { useAuth0 } from '@auth0/auth0-react'
import './button.scss'

const LogoutButton = () => {
  const { logout } = useAuth0()

  return (
    <button className="button-basic" onClick={() => logout({logoutParams: { returnTo: window.location.origin }})}>
      Log Out
    </button>
  )
}

export default LogoutButton
