import AuthRedirect from '../../utils/authRedirect';
import Loading from '../../components/loading/loading';
import useGetData from '../../utils/getdata';
import AuthLevelInfo from '../../utils/authLevelInfo';
import { useEffect, useState } from 'react';
import CharactersListPage from './CharactersListPage';
import CharacterDisplayPage from './CharacterDisplay';
import CharacterCreate from './CharacterCreate';
import formJSON from '../../jsonfiles/characterinput.json';
import CharacterEdit from './CharacterEdit';
import { ClickAwayListener, css, keyframes, styled } from '@mui/material';
import { useSnackbar } from '@mui/base/useSnackbar';
import PropTypes from 'prop-types';

export default function CharactersIndex(props) {
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

    const approvQuery = useGetData('listApprovedCharacters', '/api/v1/CharacterSheetApproveds');  
    const unapprovQuery = useGetData('listUnapprovedCharacters', '/api/v1/CharacterSheets');
    const allTagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead');
    const userGuidQuery = useGetData('userguid', '/api/v1/Users/CurrentGuid');
    const authLevel = AuthLevelInfo();
    const [charactersState, setCharactersState] = useState({
          selectedApproved: true,
          commentFilter: false,
          showApprovableOnly: false,
          readyApproved: false,
          viewingItem: false,
          viewItemGuid: '',
          viewItemPath: ''
      });

      const [filterState, setFilterState] = useState(null);
      const [isCreate, setIsCreate] = useState(false);
      const [snackOpen, setSnackOpen] = useState(
        {isOpen:false,
        text: ''});
  

     const OpenSnack = async (e) => {
      await setSnackOpen(  {isOpen:true,
        text: e});
     }

    const [isEdit, setIsEdit] = useState({isEditing: false, guid: null});
    const [filterInit, setfilterInit] = useState(false);

    useEffect(() => {
      if (props.ismain === true) {
        setIsCreate(false);
        setIsEdit({isEditing: false, guid: null});
        setfilterInit(true);
        setFilterState(props.subState.filter);
      
        if (props.subState.filter !== undefined && props.subState.filter !== null ) {
        for (const key in props.subState.filter) {
          if (props.subState.filter[key] !== undefined && props.subState.filter[key] !== null && key !== 'filters') {
               setCharactersState({
              ...charactersState,
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
        setCharactersState({
          ...charactersState,
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
     

    const DirectToCharacter = async (path, guid) => {
      //  setCharactersState({
      //      ...charactersState,
      //      viewingItem: true,
      //      viewItemGuid: guid,
      //      viewItemPath: path});
     props.toggleSubScreen(false, 'View', guid, path, filterState);
    }

    const GoBackToList = async () => {
      await setCharactersState({
        ...charactersState,
        viewingItem: false
    });
    props.toggleSubScreen(true, '', '' ,'', 'goback');
    await setfilterInit(true);
    }

    const GoToEditCharacter = async (path, guid) => {
      props.toggleSubScreen(false, 'Edit', guid, path, filterState);
    }

    const UnInitFiler = () => {
      setfilterInit(false);
    }

    const NewCharacterLink = async () => {
      //await setIsCreate(true);
      props.toggleSubScreen(false, 'Create', '', '', filterState);
    }

    const GoBackFromCreateEdit = async () => {
       await setCharactersState({
        selectedApproved: true,
        commentFilter: false,
        showApprovableOnly: false,
        viewingItem: false,
        viewItemGuid: '',
        viewItemPath: ''
    }); 
      //await setIsCreate(false);
      // await setIsEdit({isEditing: false, guid: null});
     // await setfilterInit(true);
      props.toggleSubScreen(true, '', '','', 'goback');
    }

    const pushFilter = (filter) => {
      setFilterState({...filterState,  filter});
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
{ charactersState.viewingItem === false ? 
 !isCreate ?
 !isEdit.isEditing ?
<>
<CharactersListPage 
FilterInit={filterInit}
UnInitFiler={() => UnInitFiler()}
Filters={props.subState !== undefined && props.subState !== null &&
  props.subState.filter !== undefined && props.subState.filter !== null ? 
  props.subState.filter : null
}
appdata={approvQuery.data} 
  undata={unapprovQuery.data} 
  larpTags={allTagsQuery.data.find((tags) => tags.tagType === 'LARPRun')?.tagsList}
  tagslist={allTagsQuery.data.find((tags) => tags.tagType === 'Character')?.tagsList}
  authLevel={authLevel}
  userGuid={userGuidQuery.data}
  selectedApproved={ props.subState !== undefined && props.subState !== null &&
    props.subState.selectedApproved !== undefined && props.subState.selectedApproved !== null ? 
    props.subState.selectedApproved : null
    //charactersState.selectedApproved
    } 
  commentFilterOn={ props.subState !== undefined && props.subState !== null &&
    props.subState.commentFilter !== undefined && props.subState.commentFilter !== null ? 
    props.subState.commentFilter : false
    //charactersState.commentFilter
    }
  showApprovableOnly={ props.subState !== undefined && props.subState !== null &&
    props.subState.showApprovableOnly !== undefined && props.subState.showApprovableOnly !== null ? 
    props.subState.showApprovableOnly : false
    //charactersState.showApprovableOnly
    }
  readyApproved={ props.subState !== undefined && props.subState !== null &&
    props.subState.readyApproved !== undefined && props.subState.readyApproved !== null ? 
    props.subState.readyApproved : false
    //charactersState.readyApproved
    }
  ToggleSwitches={(e) => props.ToggleSwitches(e)}
  DirectToCharacter={(path, guid) => DirectToCharacter(path, guid)}
  NewCharacterLink={(e) => NewCharacterLink(e)}
  Edit={(path, guid) => GoToEditCharacter(path, guid)}
  UpdateFilter={(filter) => pushFilter(filter)}
  />
</>
: 
<>
<CharacterEdit authLevel={authLevel} formJSON={formJSON} tagslist={allTagsQuery.data} guid={isEdit.guid} path={isEdit.path}
GoBack ={() => GoBackFromCreateEdit()} 
OpenSnack ={(e) => OpenSnack(e)}/>
</>
 :
<>
<CharacterCreate formJSON={formJSON} tagslist={allTagsQuery.data} userGuid={userGuidQuery.data} 
GoBack ={() => GoBackFromCreateEdit()} />
</>
 :
<>
<CharacterDisplayPage path={charactersState.viewItemPath} guid={charactersState.viewItemGuid} userGuid={userGuidQuery.data}
GoBackToList={() => GoBackToList()} />
</>
}
{snackOpen.isOpen ? (
        <ClickAwayListener onClickAway={() => handleSnackClose()}>
          <CustomSnackbar {...getRootProps()}>{snackOpen.text}</CustomSnackbar>
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

const CustomSnackbar = styled('div')(
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

CharactersIndex.propTypes = {
  toggleSubScreen: PropTypes.func,
  subState: PropTypes.object,
  ismain:PropTypes.bool,
  ToggleSwitches: PropTypes.func
  }