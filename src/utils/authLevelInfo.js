import { useGetDataWithStale } from './getdata'
import interpAuthLevel from './authLevel'

// Derive numeric auth level from forwardauth claims
function deriveAuthLevelFromClaims (claims) {
  if (!claims || typeof claims !== 'object') return 0;

  // Try common locations for roles/groups in JWTs or forwardauth adapters
  const maybeArrays = [];
  if (Array.isArray(claims.roles)) maybeArrays.push(claims.roles);
  if (Array.isArray(claims.groups)) maybeArrays.push(claims.groups);
  if (Array.isArray(claims['realm_access']?.roles)) maybeArrays.push(claims['realm_access'].roles);
  if (Array.isArray(claims['resource_access']?.default?.roles)) maybeArrays.push(claims['resource_access'].default.roles);

  const flat = maybeArrays.flat().map(x => String(x || '').toLowerCase());
  const has = (name) => flat.includes(String(name).toLowerCase());

  // Map group/role names to existing auth words
  if (has('wizard')) return interpAuthLevel('Wizard');
  if (has('headgm')) return interpAuthLevel('HeadGM');
  if (has('secondgm')) return interpAuthLevel('SecondGM');
  if (has('approver')) return interpAuthLevel('Approver');
  if (has('writer')) return interpAuthLevel('Writer');
  if (has('reader')) return interpAuthLevel('Reader');

  // Optionally support a direct numeric level claim
  const numeric = Number(claims.authLevel ?? claims['x-auth-level']);
  if (!Number.isNaN(numeric) && numeric > 0) return numeric;

  return 0;
}

export function AuthLevelInfo () {
    // Primary: use forwardauth claims exposed by the backend at /api/v1/auth/claims
    // Fallback: legacy permission endpoint /api/v1/Users/Permission
    // Both are called with credentials and errors are treated as unauthenticated.

    // Claims are our preferred source
    const claims = useGetDataWithStale('auth_claims', '/api/v1/auth/claims', { enabled: true })

    // Only enable fallback if claims are missing or failed
    const shouldFallback = !!claims.isError || (!!claims.data && deriveAuthLevelFromClaims(claims.data) === 0) || (!claims.isLoading && !claims.data)

    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission', { enabled: shouldFallback })

    // Loading state if either the primary is loading or the fallback we need is loading
    if (claims.isLoading || (shouldFallback && userAuth.isLoading)) return 0

    // Try claims first
    if (claims.data) {
      const lvl = deriveAuthLevelFromClaims(claims.data)
      if (lvl > 0) return lvl
    }

    // Then fallback
    if (userAuth.data?.AuthLevel) return interpAuthLevel(userAuth.data.AuthLevel)

    // If both failed, consider unauthenticated
    if (claims.isError && (!shouldFallback || userAuth.isError)) return -1

    return -1
}

export default AuthLevelInfo