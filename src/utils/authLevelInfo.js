import useGetDataWithStale from './getdata'
import interpAuthLevel from './authLevel'

export function AuthLevelInfo () {
    // Cookies are HttpOnly and Secure; the SPA cannot read them via document.cookie.
    // Therefore we do not attempt to detect auth client-side. Instead, we call the
    // backend permission endpoint with credentials and interpret the response.
    // This may result in a 401/403 prior to login, which we treat as unauthenticated.
    const enabled = true;
    
    // Always call the hook with a stable signature, but disable it when not enabled
    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission', { enabled })

    if (userAuth.isLoading) return (0)
    if (userAuth.isError) return (-1)

    return interpAuthLevel(userAuth.data?.AuthLevel)
}

export default AuthLevelInfo