import useGetDataWithStale from './getdata'
import interpAuthLevel from './authLevel'

export function AuthLevelInfo () {

    const userAuth = useGetDataWithStale('permission', '/api/v1/Users/Permission')

    if (userAuth.isLoading) return (0)
    if (userAuth.isError) return (-1)

    return interpAuthLevel(userAuth.data?.AuthLevel)
}

export default AuthLevelInfo