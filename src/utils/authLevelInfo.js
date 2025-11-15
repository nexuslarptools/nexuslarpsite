import useGetDataWithStale from './getdata'
import interpAuthLevel from './authLevel'

export function AuthLevelInfo () {
    // OIDC removed: always allow permission check; backend session cookie is the source of truth
    const enabled = true;

    // Always call the hook with a stable signature, but disable it when not enabled
    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission', { enabled })

    // If we're not allowed to query yet in middleware mode, present as unauthenticated (no backend call)
    if (!enabled) return (-1)

    if (userAuth.isLoading) return (0)
    if (userAuth.isError) return (-1)

    return interpAuthLevel(userAuth.data?.AuthLevel)
}

export default AuthLevelInfo