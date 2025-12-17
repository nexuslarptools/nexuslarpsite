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
    // Use a single Permissions endpoint which is expected to include claims.
    // The response may either be the claims object itself or include a `claims` property.
    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission', { enabled: true })

    // Loading while the request is in flight
    if (userAuth.isLoading) return 0

    // Derive level from provided claims (prefer claims if present; otherwise treat whole body as claims)
    const claimsCandidate = userAuth?.data?.claims ?? userAuth?.data
    const lvlFromClaims = deriveAuthLevelFromClaims(claimsCandidate)
    if (lvlFromClaims > 0) return lvlFromClaims

    // Backward compatibility: if legacy `AuthLevel` exists, interpret it
    if (userAuth?.data?.AuthLevel) return interpAuthLevel(userAuth.data.AuthLevel)

    // If request errored or response carries no recognizable claims, treat as unauthenticated
    if (userAuth.isError) return -1

    return -1
}

export default AuthLevelInfo