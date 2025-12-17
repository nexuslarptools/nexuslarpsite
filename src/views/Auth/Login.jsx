import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthLevelInfo from '../../utils/authLevelInfo'

export default function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const authLevel = AuthLevelInfo();
  const isAuthenticated = authLevel > 0;

  useEffect(() => {
    // Capture the originally requested path from the guard (if any)
    const fromState = location?.state?.from;

    let target = '/';
    if (fromState && typeof fromState === 'object') {
      const { pathname = '/', search = '', hash = '' } = fromState;
      target = `${pathname}${search}${hash}`;
    } else if (typeof fromState === 'string') {
      target = fromState || '/';
    }

    try { sessionStorage.setItem('returnTo', target); } catch {}

    // If we're already authenticated and somehow on /login, immediately
    // send the user back to their intended destination.
    if (isAuthenticated) {
      let stored = '/';
      try { stored = sessionStorage.getItem('returnTo') || '/'; } catch {}
      try { sessionStorage.removeItem('returnTo'); } catch {}
      navigate(stored, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  // Render nothing so only the shared Header (with Login button) shows.
  return null;
}
