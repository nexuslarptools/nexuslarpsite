import { useAuth0 } from '@auth0/auth0-react'
import './button.scss'

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  return <button className="button-basic" onClick={() => loginWithRedirect()}>Log In</button>
}

export default LoginButton
