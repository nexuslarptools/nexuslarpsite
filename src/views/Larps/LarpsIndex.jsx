import { useState } from 'react'
import useGetData from '../../utils/getdata'
import Loading from '../../components/loading/loading'
import AuthLevelInfo from '../../utils/authLevelInfo'
import LarpsListPage from './LarpsListPage'
import LarpsCreate from './LarpsCreate'
import LarpsEdit from './LarpsEdit'
import DeleteDialogFull from '../../components/dialogs/deletedialogcomplete'
import UserRolesEditForm from '../../components/forms/userroleseditform'

export default function LarpsIndex() {

    const [viewingCreateOrEdit, setViewingCreateOrEdit] = useState({
        isViewing: false,
        defaultInfo: null
    })

    const [editUserInfo, seteditUserInfo] = useState({
        isEditing: false,
        guid: ''
    })

    const[deleteDialog, setDeleteDialog] = useState({
        open: false,
        tag: null
    })

    const GoToNewEdit = (e) => {
        if (e === undefined || e === null) {
            setViewingCreateOrEdit({
                ...viewingCreateOrEdit,
                isViewing: true,
                defaultInfo: null
            })
        }
        else {
            const larpInfo = larpsQuery.data.find((larp) => larp.guid === e)
            setViewingCreateOrEdit({
                ...viewingCreateOrEdit,
                isViewing: true,
                defaultInfo: larpInfo
            })
        }
    }

    const GoBack = () => {
        setViewingCreateOrEdit({
            ...viewingCreateOrEdit,
            isViewing: false,
            defaultInfo: null
        })
    }

    const DeleteTag = (e) => {
        setDeleteDialog({
            open: true,
            tag: e
        })
    }

    const handleFullDeleteClose = () => {
        setDeleteDialog({
            open: false,
            tag: null
        })
    }

    const GoToUserEdit = (guid) => {
        seteditUserInfo({
            isEditing: true,
            guid: guid
        })
    }

    const GoBackFromUserEdit = () => {
        seteditUserInfo({
            isEditing: false,
            guid: ''
        })
    }

    const authLevel = AuthLevelInfo()
    const larpsQuery = useGetData('listLarpsWithGMs', '/api/v1/LARPS/WithGMs') 
    const userData = useGetData('userList', '/api/v1/Users')
    const currentUserGuid = useGetData('currentUserGuid', '/api/v1/Users/CurrentGuid')
    
    if ( larpsQuery.isLoading) 
    return (<div>
    <Loading />
    </div>)



  if (larpsQuery.isError) return (<div>
            Error!
            </div>)

    return (
        <>
        {  editUserInfo.isEditing ?
        <>
          <UserRolesEditForm GoBack ={() => GoBackFromUserEdit()} 
          data={userData.data.find((user) => user.guid === editUserInfo.guid )}
          authlevel={authLevel}
          isSelfEdit={editUserInfo.guid === currentUserGuid.data }
          /> 
          </>
          : <>
        {viewingCreateOrEdit.isViewing === false ? 
        <>
       <LarpsListPage 
       GoToUserEdit={(guid) => GoToUserEdit(guid)}
        data={larpsQuery.data}
        authLevel={authLevel}
        GoToNewEdit={(e) => GoToNewEdit(e)}
        DeleteTag={(e) => DeleteTag(e)} />
        <>
        { deleteDialog.open ?
        <>
        <DeleteDialogFull 
        open={deleteDialog.open} 
        data={deleteDialog.tag} 
        handleFullDeleteClose={() => handleFullDeleteClose()}
        apiPath={{path:'Larps', refreshName:'listLarps', mutationName:'larpsDelete'  }}  />
        </> :
        <></>
         }
        </>
        </> : <>
        { viewingCreateOrEdit.defaultInfo !== null ?
        <>
       <LarpsEdit GoBack={() => GoBack()} larpList={larpsQuery.data} data={viewingCreateOrEdit.defaultInfo} />
       </> :
        <>
        <LarpsCreate GoBack={() => GoBack()} larpList={larpsQuery.data} data={viewingCreateOrEdit.defaultInfo} />
    </>
}
        </>
        }  
    </>
}
</>
    )
}
