import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthLevelInfo from './authLevelInfo'

export function AuthRedirect (lowestAllowed) {
    const navigate = useNavigate()
    const authLevel = AuthLevelInfo();
    useEffect(() => {
      // Wait until auth has resolved (0 = loading)
      if (authLevel === 0) return;
      if (authLevel < lowestAllowed) {
        navigate('/');
      }
    }, [authLevel, lowestAllowed, navigate])
}

export default AuthRedirect