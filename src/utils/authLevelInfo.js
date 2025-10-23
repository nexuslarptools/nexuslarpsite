import useGetDataWithStale from './getdata'
import interpAuthLevel from './authLevel'
import { getConfig } from '../config'

export function AuthLevelInfo () {
    const cfg = getConfig();
    const usingMiddleware = !cfg.OIDC_AUTHORIZATION_ENDPOINT; // If no direct OIDC settings, assume middleware/BFF

    // Gate backend call until we know we have an authenticated session in middleware mode
    const sessionActive = typeof window !== 'undefined' && window.localStorage?.getItem('sessionActive') === 'true';
    const enabled = !usingMiddleware || sessionActive;

    // Always call the hook with a stable signature, but disable it when not enabled
    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission', { enabled })

    // If we're not allowed to query yet in middleware mode, present as unauthenticated (no backend call)
    if (!enabled) return (-1)

    if (userAuth.isLoading) return (0)
    if (userAuth.isError) return (-1)

    return interpAuthLevel(userAuth.data?.AuthLevel)
}

export default AuthLevelInfo