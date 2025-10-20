import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import interpAuthLevel from './authLevel'
import configJson from '../auth_config.json'
import { getConfig } from '../config'

const {
    apiOrigin =
    configJson.APILocation
  } = getConfig()

export function AuthRedirect (lowestAllowed) {
    const navigate = useNavigate()
    useEffect(() => {
        const navigateAway = async () => {
        try {
          const response = await fetch(apiOrigin + '/api/v1/Users/Permission', {
            credentials: 'include'
          }).then(r => r.json());
          const authlevel = interpAuthLevel(response.AuthLevel)
          if (authlevel < lowestAllowed) {
              navigate('/')
          }
        } catch (e) {
          // On error, assume not authorized and navigate away
          navigate('/')
        }
      }
      navigateAway()
    }, [lowestAllowed, navigate])
}

export default AuthRedirect