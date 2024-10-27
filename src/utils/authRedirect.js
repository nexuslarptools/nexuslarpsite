import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export function AuthRedirect (lowestAllowed) {
    const navigate = useNavigate()
    useEffect(() => {
        const navigateAway = async () => {
       if (3 < lowestAllowed) {
           navigate('/')
      }
      }
      navigateAway()
    }, [lowestAllowed, navigate])

}

export default AuthRedirect