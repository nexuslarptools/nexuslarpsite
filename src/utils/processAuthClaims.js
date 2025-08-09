
export function ProcessAuthClaims(claims)
{
    if (claims !== undefined && claims !== null) {
     let permissions = claims['https://NexusLarps.com/permissions'];
            let auth = permissions.authorization;
            let effectiveauth = 0;

            auth.roles.forEach(role => {
              role.permissions.forEach(perm => {
                if (perm > effectiveauth)
                {
                  effectiveauth=perm;
                }
              })
            });

            return({
                permissions:auth,
                role:claims['https://NexusLarps.com/role'],
                authLevel:effectiveauth
            });
        }
            return({
                permissions:null,
                role:[],
                authLevel:0
            });
}
export default ProcessAuthClaims;