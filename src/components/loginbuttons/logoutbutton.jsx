import './button.scss'

const LogoutButton = () => {
  const onClick = () => {
    const redirect = encodeURIComponent(window.location.origin);
    // Navigate to our app's logout route which will call the backend and then redirect back
    window.location.assign(`/oauth2/logout?redirect=${redirect}`);
  };

  return (
    <button className="button-basic" onClick={onClick}>
      Log Out
    </button>
  )
}

export default LogoutButton
