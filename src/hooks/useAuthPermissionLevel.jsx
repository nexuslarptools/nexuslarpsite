import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";

const useAuthPermissionLevel = () => {

const authob = useAuth0();

     const [authState, setAuthState] = useState({
         user: null,
         isAuthenticated: false,
         isAuthLoading: true
     });

    const [permissionState, SetPermissionState] = useState({
         permissions: null,
         role: null,
         authLevel:0
     });

     useEffect( () => {
      if (authob.isAuthenticated) {
        getMetaData();
      }
     }, [authob.isAuthenticated])

     const getMetaData = async () => {
           const claims = await authob.getIdTokenClaims();
            // Access your custom claim using the namespaced URL
            let permissions = claims['https://NexusLarps.com/permissions'];
            let auth = permissions.authorization;
            let effectiveauth = 0;

            auth.roles.forEach((role) => {
              role.permissions.forEach((perm) => {
                if (perm > effectiveauth)
                {
                  effectiveauth=perm;
                }
              })
            });

            await SetPermissionState({
                permissions:auth,
                role:claims['https://NexusLarps.com/role'],
                authLevel:effectiveauth
            });
          await setAuthState({
            user: authob.user,
            isAuthenticated: authob.isAuthenticated,
            isAuthLoading: false
         });
     }


     return [authState, permissionState];
};

export default useAuthPermissionLevel