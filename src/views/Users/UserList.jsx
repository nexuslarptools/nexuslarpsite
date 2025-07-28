import { useEffect, useState } from 'react'
import useGetData from '../../utils/getdata'
import UserTable from '../../components/tables/userstable'
import AuthRedirect from '../../utils/authRedirect'
import UserRolesEditForm from '../../components/forms/userroleseditform'
import './UserList.scss'
import AuthLevelInfo from '../../utils/authLevelInfo'
import Loading from '../../components/loading/loading'
import PropTypes from 'prop-types'


export default function UsersPage(props) {

AuthRedirect(4);
const authLevel = AuthLevelInfo();

const [arrowsState, setArrowsState] = useState({
    arrowsList: []
  })
  const [currUserState, setCurrUserState] = useState({
    viewingEdit: false,
    guid: ''
})

const userData = useGetData('userList', '/api/v1/Users')
const currentUserGuid = useGetData('currentUserGuid', '/api/v1/Users/CurrentGuid')

const GoToEdit = async (e) => {
  await setCurrUserState({
    ...currUserState,
    viewingEdit: true,
    guid: e
  });
}

const GoBack = async () => {
  await setCurrUserState({
    ...currUserState,
    viewingEdit: false,
    guid: ''
  })

  props.toggleSubScreen(false);
}

useEffect(() => {
    const fillin = []
    if (userData.data !== undefined)
    {
    userData.data?.forEach(name => {
      fillin.push({ guid: name.guid, opened: false })
    })

    setArrowsState({
      arrowsList: fillin
    })
    }
  }, [userData.data])

  const ArrowClickHandler = (e) => {
    const fillin = []

    arrowsState.arrowsList.forEach(name => {
        if (e === name.guid) {
            if (name.opened === true) {
                fillin.push({ guid: name.guid, opened: false })
            }
            else {
                fillin.push({ guid: name.guid, opened: true })
            }
        }
        else {
        fillin.push({ guid: name.guid, opened: name.opened })
        }
      })

      setArrowsState({
        arrowsList: fillin
      })

      //props.toggleSubScreen(true);
  }

if (userData.isLoading || currentUserGuid.isLoading) return (<div>
      <Loading />
      </div>)
  if (userData.isError || currentUserGuid.isError) return (<div>
      Error!
      </div>)

return (
  <>
  { currUserState.viewingEdit === false ? 
  <>
   <UserTable data={userData.data} authlevel={authLevel} GoToEdit={(e) => GoToEdit(e) }
   arrowsList={arrowsState.arrowsList} ArrowClick={(e) => ArrowClickHandler(e)}/>
  </> :
  <>
  <UserRolesEditForm GoBack ={() => GoBack()} 
  data={userData.data.find((user) => user.guid === currUserState.guid )}
  authlevel={authLevel}
  isSelfEdit={currUserState.guid === currentUserGuid.data }
  />
  </> 
  }
  </>
)
}

UsersPage.propTypes = {
  toggleSubScreen: PropTypes.func
}

