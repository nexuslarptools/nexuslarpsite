import './button.scss'

// Simplified login: always call backend login endpoint
const LoginButton = () => {
  const onClick = () => {
    window.location.assign('/api/v1/login');
  };

  return <button className="button-basic" onClick={onClick}>Log In</button>
}

export default LoginButton
