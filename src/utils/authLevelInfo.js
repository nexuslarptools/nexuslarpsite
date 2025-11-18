import useGetDataWithStale from './getdata'
import interpAuthLevel from './authLevel'

export function AuthLevelInfo () {
    // Only call backend when we believe a session is active. This prevents calls before login.
    // Prefer cookie-based detection: backend sets HttpOnly cookies with prefix `_oidc_raczylo`.
    let enabled = false;

    const hasOidcCookie = () => {
        try {
            const all = document.cookie || '';
            // Split cookies and check any name that starts with our prefix
            return all.split(';').some(kv => kv.trim().startsWith('_oidc_raczylo'));
        } catch {
            return false;
        }
    };

    // Primary: cookie presence; Fallback: legacy localStorage hint set by OAuth callback
    enabled = hasOidcCookie();
    if (!enabled) {
        try {
            enabled = window.localStorage.getItem('sessionActive') === 'true';
        } catch {}
    }
    
    // Always call the hook with a stable signature, but disable it when not enabled
    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission', { enabled })

    // If we're not allowed to query yet in middleware mode, present as unauthenticated (no backend call)
    if (!enabled) return (-1)

    if (userAuth.isLoading) return (0)
    if (userAuth.isError) return (-1)

    return interpAuthLevel(userAuth.data?.AuthLevel)
}

export default AuthLevelInfo