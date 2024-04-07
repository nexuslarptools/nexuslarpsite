import { useState } from 'react'
import getUserData from '../../utils/getcurrentuser'
import UserDisplay from '../../components/displays/userdisplay'
import UserSelfEditForm from '../../components/forms/userselfeditform'
import useGetData from '../../utils/getdata'
import Loading from '../../components/loading/loading'
import UserRolesEditForm from '../../components/forms/userroleseditform'

export default function CurrentUserPage() {

  const [currUserState, setCurrUserState] = useState({
    viewingEdit: false,
})

const ToggleEdit = async (refresh) => {
  const tog = !currUserState.viewingEdit
  setCurrUserState({
      ...currUserState,
      viewingEdit: tog})

      if (refresh === true)
      {
        currUserQuery.refetch()
      }
}

    const currUserQuery = getUserData();  
    const currPronounQuery = useGetData('pronounsList', '/api/v1/Pronouns');
    
    
    if (currUserQuery.isLoading || currUserQuery.isRefetching ||
      currPronounQuery.isLoading) return (<div>
        <Loading />
        </div>)
      if (currUserQuery.isError || currPronounQuery.isError) return (<div>
          Error!
          </div>)


return (
<>
{ currUserState.viewingEdit === false ? 
<>
<UserDisplay data={currUserQuery.data} GoToEdit={() => ToggleEdit(false) }/>
</> :
<>
<UserRolesEditForm GoBack={(e) => ToggleEdit(e)} 
  data={currUserQuery.data}
  authlevel={6}
  isSelfEdit={true}
  />
</>
}
</>
)
}
