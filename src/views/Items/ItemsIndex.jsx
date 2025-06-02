import { useEffect, useState } from 'react';
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
import { ClickAwayListener, css, keyframes, styled } from '@mui/material';
import { useSnackbar } from '@mui/base';


export default function ItemsIndex(props) {
  AuthRedirect(1)

  const handleSnackClose = () => {
    setSnackOpen({isOpen:false,
      text: ''});
  }

  const { getRootProps } = useSnackbar({
    onClose: handleSnackClose,
    open,
    autoHideDuration: 5000,
  });

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
      const [filterState, setFilterState] = useState(null);
      const [isCreate, setIsCreate] = useState(false);
      const [isSelect, setIsSelect] = useState(false);
      const [isEdit, setIsEdit] = useState({isEditing: false, guid: null});
      const [snackOpen, setSnackOpen] = useState(
        {isOpen:false,
        text: ''});


        
            useEffect(() => {
              if (props.ismain === true) {
                setIsCreate(false);
                setIsEdit({isEditing: false, guid: null});
                setFilterState(props.subState.filter);
              
                if (props.subState.filter !== undefined && props.subState.filter !== null ) {
                for (const key in props.subState.filter) {
                  if (props.subState.filter[key] !== undefined && props.subState.filter[key] !== null && key !== 'filters') {
                    setItemsState({
                      ...itemsState,
                      [key]: props.subState.filter[key]
                    });
                  }
              }
            }
        
              }
              else {
                if (props.subState.funct === 'Create')
                  setIsCreate(true);
              }
              if (props.subState.funct === 'View')
              {
                setItemsState({
                  ...itemsState,
                  viewingItem: true,
                  viewItemGuid: props.subState.guid,
                  viewItemPath: props.subState.path});
              }
              if (props.subState.funct === 'Edit')
                {
                  setIsEdit({isEditing: true, 
                    guid: props.subState.guid,
                    path: props.subState.path
                  });
                }
            }, [])
  
     const OpenSnack = async (e) => {
      await setSnackOpen(        {isOpen:true,
        text: e});
     }
        const DirectToItem = async (path, guid) => {
          props.toggleSubScreen(false, 'View', guid, path, filterState);
        }

        const GoToEditItem = async (path, guid) => {
           props.toggleSubScreen(false, 'Edit', guid, path, filterState);
        }

        const NewItemLink = async () => {
          await setIsCreate(true);
        }

        const GoBackFromCreateEdit = async () => {
          props.toggleSubScreen(true, '', '' ,'', 'goback');
        }

        const pushFilter = (filter) => {
          props.toggleSubScreen(true, '', '','', filter);
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
  Filters={props.subState !== undefined && props.subState !== null &&
    props.subState.filter !== undefined && props.subState.filter !== null ? 
    props.subState.filter : null
  }
  larpTags={allTagsQuery.data.find((tags) => tags.tagType === 'LARPRun')?.tagsList}
  tagslist={allTagsQuery.data.find((tags) => tags.tagType === 'Item')?.tagsList}
  authLevel={authLevel}
  userGuid={userGuidQuery.data}
  selectedApproved={props.subState.selectedApproved} 
  commentFilterOn={props.subState.commentFilter}
  showApprovableOnly={props.subState.showApprovableOnly}
  readyApproved={props.subState.readyApproved}
  ToggleSwitches={(e) => props.ToggleSwitches(e)}
  DirectToItem={(path, guid) => DirectToItem(path, guid)}
  NewItemLink={(e) => NewItemLink(e)}
  NavToSelectItems={() => setIsSelect(true)}
  Edit={(path, guid) => GoToEditItem(path, guid)}
  UpdateFilter={(filter) => pushFilter(filter)}
  />
</>
:
<> 
<ItemSelector appdata={approvQuery.data} 
  isCharSheet={false}
  undata={unapprovQuery.data} 
  Filters={props.subState !== undefined && props.subState !== null &&
    props.subState.filter !== undefined && props.subState.filter !== null ? 
    props.subState.filter : null
  }
  initialItems={{show:false, label:'Selection for Printing'}}
  larpTags={allTagsQuery.data.find((tags) => tags.tagType === 'LARPRun')?.tagsList}
  tagslist={allTagsQuery.data.find((tags) => tags.tagType === 'Item')?.tagsList}
  authLevel={authLevel}
  userGuid={userGuidQuery.data}
  selectedApproved={itemsState.selectedApproved} 
  commentFilterOn={itemsState.commentFilter}
  showApprovableOnly={itemsState.showApprovableOnly}
  GoBack={() => setIsSelect(false)}
  UpdateItemList={() => void 0}
  UpdateFilter={(filter) => pushFilter(filter)}
  ToggleSwitches={(e) => props.ToggleSwitches(e)}
  />
</> 
: 
<>
<ItemEdit formJSON={formJSON} tagslist={allTagsQuery.data} guid={isEdit.guid} path={isEdit.path}
OpenSnack ={(e) => OpenSnack(e)} GoBack ={() => GoBackFromCreateEdit()} />
</>
 :
<>
<ItemCreate formJSON={formJSON} tagslist={allTagsQuery.data} 
GoBack ={() => GoBackFromCreateEdit()} />
</>
 :
<>
<ItemDisplay path={itemsState.viewItemPath} guid={itemsState.viewItemGuid}
GoBackToList={() => GoBackFromCreateEdit()} />
</>
}
{snackOpen.isOpen ? (
        <ClickAwayListener onClickAway={() => handleSnackClose()}>
          <CustomSnackBar {...getRootProps()}>{snackOpen.text}</CustomSnackBar>
        </ClickAwayListener>
      ) : null}
</>
 )
}


const snackbarInRight = keyframes`
  from {
    transform: translateX(100%);
  }

  to {
    transform: translateX(0);
  }
`;

const CustomSnackBar = styled('div')(
  ({ theme }) => css`
    position: fixed;
    z-index: 5500;
    display: flex;
    right: 16px;
    bottom: 16px;
    left: auto;
    justify-content: space-between;
    max-width: 560px;
    min-width: 300px;
    background-color: ${'#fff'};
    border-radius: 8px;
    border: 1px solid ${'#DAE2ED'};
    box-shadow: ${`0 2px 8px ${'#DAE2ED'}`};
    padding: 0.75rem;
    color: ${'#1C2025'};
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 600;
    animation: ${snackbarInRight} 200ms;
    transition: transform 0.2s ease-out;
  `
);

ItemsIndex.propTypes = {
  NewItemLink: PropTypes.func,
  NavToSelectItems: PropTypes.func,
  subState: PropTypes.object,
  ToggleSwitches: PropTypes.func,
  toggleSubScreen: PropTypes.func,
  ismain: PropTypes.bool
}