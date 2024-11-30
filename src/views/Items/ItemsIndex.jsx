import { useState } from 'react';
import useGetData from '../../utils/getdata';
import Loading from '../../components/loading/loading';
import ItemsListPage from './ItemsListPage';
import ItemDisplay from './ItemDisplay';
import AuthRedirect from '../../utils/authRedirect';
import AuthLevelInfo from '../../utils/authLevelInfo';
import PropTypes from 'prop-types';
import ItemCreate from './ItemCreate';
import formJSON from '../../jsonfiles/iteminput.json';
import ItemEdit from './ItemEdit';
import ItemSelector from '../../components/itemselector/itemselector';


export default function ItemsIndex() {
  AuthRedirect(1)

      const approvQuery = useGetData('listApprovedItems', '/api/v1/ItemSheetApproveds/FullListWithTagsNoImages');  
      const unapprovQuery = useGetData('listUnapprovedItems', '/api/v1/ItemSheets/FullListWithTagsNoImages');
      const allTagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead');
      const userGuidQuery = useGetData('userguid', '/api/v1/Users/CurrentGuid');
      const authLevel = AuthLevelInfo();
      const [itemsState, setItemsState] = useState({
            selectedApproved: true,
            commentFilter: false,
            showApprovableOnly: false,
            viewingItem: false,
            viewItemGuid: '',
            viewItemPath: ''
        });
      const [isCreate, setIsCreate] = useState(false);
      const [isSelect, setIsSelect] = useState(false);
      const [isEdit, setIsEdit] = useState({isEditing: false, guid: null});

      const ToggleSwitch = async (e) => {
            let toggled=itemsState[e];

            if (e === 'selectedApproved' && itemsState.showApprovableOnly) {
              await setItemsState({
                ...itemsState,
                [e]: !toggled,
                showApprovableOnly:false
            });
            }
            else {
            await setItemsState({
                ...itemsState,
                [e]: !toggled
            });
          }
        }   

        const DirectToItem = async (path, guid) => {
            setItemsState({
                ...itemsState,
                viewingItem: true,
                viewItemGuid: guid,
                viewItemPath: path});
        }

        const GoBackToList = async () => {
            setItemsState({
                ...itemsState,
                viewingItem: false,
                viewItemGuid: '',
                viewItemPath: ''});
        }

        const GoToEditItem = async (path, guid) => {
          await setIsEdit({isEditing: true, guid: guid, path: path});
        }

        const NewItemLink = async () => {
          await setIsCreate(true);
        }

        const GoBackFromCreateEdit = async () => {
          await setIsCreate(false);
          await setIsEdit({isEditing: false, guid: null});
        }

      if (approvQuery.isLoading || unapprovQuery.isLoading || allTagsQuery.isLoading || userGuidQuery.isLoading) 
        return (<div>
        <Loading />
        </div>)
      if (approvQuery.isError || unapprovQuery.isError || allTagsQuery.isError || userGuidQuery.isError) return (<div>
                Error!
                </div>)

return (
<>
{ itemsState.viewingItem === false ? 
 !isCreate ?
 !isEdit.isEditing ?
 !isSelect ?
<>
<ItemsListPage appdata={approvQuery.data} 
  undata={unapprovQuery.data} 
  larpTags={allTagsQuery.data.find((tags) => tags.tagType === 'LARPRun')?.tagsList}
  tagslist={allTagsQuery.data.find((tags) => tags.tagType === 'Item')?.tagsList}
  authLevel={authLevel}
  userGuid={userGuidQuery.data}
  selectedApproved={itemsState.selectedApproved} 
  commentFilterOn={itemsState.commentFilter}
  showApprovableOnly={itemsState.showApprovableOnly}
  ToggleSwitch={() => ToggleSwitch('selectedApproved')}
  ToggleCommentSwitch={() => ToggleSwitch('commentFilter')}
  ToggleApprovableSwitch={() => ToggleSwitch('showApprovableOnly')}
  DirectToItem={(path, guid) => DirectToItem(path, guid)}
  NewItemLink={(e) => NewItemLink(e)}
  NavToSelectItems={() => setIsSelect(true)}
  Edit={(path, guid) => GoToEditItem(path, guid)}
  />
</>
:
<> 
<ItemSelector appdata={approvQuery.data} 
  isCharSheet={false}
  undata={unapprovQuery.data} 
  initialItems={{show:false, label:'Selection for Printing'}}
  larpTags={allTagsQuery.data.find((tags) => tags.tagType === 'LARPRun')?.tagsList}
  tagslist={allTagsQuery.data.find((tags) => tags.tagType === 'Item')?.tagsList}
  authLevel={authLevel}
  userGuid={userGuidQuery.data}
  selectedApproved={itemsState.selectedApproved} 
  commentFilterOn={itemsState.commentFilter}
  showApprovableOnly={itemsState.showApprovableOnly}
  ToggleSwitch={() => ToggleSwitch('selectedApproved')}
  ToggleCommentSwitch={() => ToggleSwitch('commentFilter')}
  ToggleApprovableSwitch={() => ToggleSwitch('showApprovableOnly')}
  GoBack={() => setIsSelect(false)}
  UpdateItemList={() => void 0}
  />
</> 
: 
<>
<ItemEdit formJSON={formJSON} tagslist={allTagsQuery.data} guid={isEdit.guid} path={isEdit.path}
GoBack ={() => GoBackFromCreateEdit()} />
</>
 :
<>
<ItemCreate formJSON={formJSON} tagslist={allTagsQuery.data} 
GoBack ={() => GoBackFromCreateEdit()} />
</>
 :
<>
<ItemDisplay path={itemsState.viewItemPath} guid={itemsState.viewItemGuid}
GoBackToList={() => GoBackToList()} />
</>
}
</>
 )
}

ItemsIndex.propTypes = {
  NewItemLink: PropTypes.func,
  NavToSelectItems: PropTypes.func
}