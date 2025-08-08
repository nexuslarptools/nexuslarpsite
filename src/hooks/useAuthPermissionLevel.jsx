import { useAuth0 } from "@auth0/auth0-react"
import { useEffect, useState } from "react";

const useAuthPermissionLevel = () => {
 const { user, isAuthenticated, getIdTokenClaims } = useAuth0();

     const [authState, setAuthState] = useState({
         user: null,
         isAuthenticated: false,
         isAuthLoading: true
     });

    const [tokenState, setTokenState] = useState({
         claims: null
     });

     useEffect( () => {
        getMetaData();
     }, [isAuthenticated])

     const getMetaData = async () => {
        if (isAuthenticated) {
          await setAuthState({
            user: user,
            isAuthenticated: isAuthenticated
         });
         if (isAuthenticated) {
           const claims = await getIdTokenClaims();
            // Access your custom claim using the namespaced URL
            await setTokenState(claims['https://NexusLarps.com/app_metadata']);
          }
       }
     }


     return [authState, tokenState];
};

export default useAuthPermissionLevel