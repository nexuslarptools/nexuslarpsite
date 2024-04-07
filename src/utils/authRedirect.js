import { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'
import interpAuthLevel from './authLevel'
import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

export function AuthRedirect (lowestAllowed) {
    const auth = useAuth0();
    const navigate = useNavigate()
    useEffect(() => {
        const navigateAway = async () => {
        const token = await auth.getAccessTokenSilently();
        const response = await fetch(apiOrigin + '/api/v1/Users/Permission', {
          headers: {Authorization: `Bearer ${token}`}
        }).then(response => response.json())

      const authlevel = interpAuthLevel(response.AuthLevel)
       if (authlevel < lowestAllowed) {
           navigate('/')
      }
      }
      navigateAway()
    }, [lowestAllowed, auth, navigate])

}

export default AuthRedirect