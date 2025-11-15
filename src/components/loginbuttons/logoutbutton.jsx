import './button.scss'

const LogoutButton = () => {
  const onClick = () => {
    const redirect = encodeURIComponent(window.location.origin);
    // Call backend logout endpoint; backend should handle redirect if needed
    window.location.assign(`/api/logout?redirect=${redirect}`);
  };

  return (
    <button className="button-basic" onClick={onClick}>
      Log Out
    </button>
  )
}

export default LogoutButton
