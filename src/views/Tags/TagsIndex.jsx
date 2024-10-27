import { useState } from 'react'
import useGetData from '../../utils/getdata'
import Loading from '../../components/loading/loading'
import AuthLevelInfo from '../../utils/authLevelInfo'
import TagsListPage from './TagsListPage'
import TagsEdit from './TagsEdit'
import TagsCreate from './TagsCreate'

export default function TagsIndex() {

    const [dropdownSelect, setDropdownSelect] = useState('Character')
    const [viewingCreateOrEdit, setViewingCreateOrEdit] = useState({
        isViewing: false,
        defaultInfo: null
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
            const tagList = tagsQuery.data.find((taglists) => taglists.tagType === dropdownSelect )
            const taginfo = tagList.tagsList.find((tag) => tag.guid === e)
            setViewingCreateOrEdit({
                ...viewingCreateOrEdit,
                isViewing: true,
                defaultInfo: taginfo
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

    const handleFullDeleteClose = () => {
        setDeleteDialog({
            open: false,
            tag: null
        })
    }

    const authLevel = AuthLevelInfo()
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead') 
    const larpsQuery = useGetData('listPersonalLarps', '/api/v1/LARPS/Accessible') 

    if (tagsQuery.isLoading || larpsQuery.isLoading) 
    return (<div>
    <Loading />
    </div>)

if (tagsQuery.isError || larpsQuery.isError) 
  return (<div>
    Error!
    </div>)

    const tagsSelected = tagsQuery.data.find((element) =>  
        element.tagType === dropdownSelect
    )

    let dropDownArray = []
    tagsQuery.data.forEach(element => 
        {
        if(element.tagsList.length > 0) {
            const tagTypeInfo = {
              name: element.tagType,
              guid: element.tagsList[0].tagtypeguid
        }
        dropDownArray.push(tagTypeInfo) 
      }
     });

    if (larpsQuery.data[0].name !== '') {
    const blankLarp = 
    {
        name:'',
        guid:''
    }
    larpsQuery.data.unshift(blankLarp)
}

    return (
        <>
        {viewingCreateOrEdit.isViewing === false ? 
        <>
       <TagsListPage data={tagsSelected.tagsList} 
           dropDownArray={dropDownArray} 
            dropdownSelect={dropdownSelect} 
              authLevel={authLevel}
              onOptionClicked={(e) => setDropdownSelect(e)}
              GoToNewEdit={(e) => GoToNewEdit(e)}/>
                      <>
        </>
        </>
          : <>
        { viewingCreateOrEdit.defaultInfo !== null ?
        <>
        <TagsEdit GoBack={() => GoBack()} larpList={larpsQuery.data} dropDownArray={dropDownArray} data={viewingCreateOrEdit.defaultInfo} />
        </> :
        <>
         <TagsCreate GoBack={() => GoBack()} larpList={larpsQuery.data} dropDownArray={dropDownArray} data={viewingCreateOrEdit.defaultInfo} />
        </>
}
        </>
        }  
    </>
    )
}
