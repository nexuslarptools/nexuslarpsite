import AuthRedirect from '../../utils/authRedirect';
import Loading from '../../components/loading/loading';
import useGetData from '../../utils/getdata';
import AuthLevelInfo from '../../utils/authLevelInfo';
import { useState } from 'react';
import CharactersListPage from './CharactersListPage';
import CharacterDisplayPage from './CharacterDisplay';
import CharacterCreate from './CharacterCreate';
import formJSON from '../../jsonfiles/characterinput.json';
import CharacterEdit from './CharacterEdit';

export default function CharactersIndex() {
    AuthRedirect(1)

    const approvQuery = useGetData('listApprovedCharacters', '/api/v1/CharacterSheetApproveds');  
    const unapprovQuery = useGetData('listUnapprovedCharacters', '/api/v1/CharacterSheets');
    const allTagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead');
    const userGuidQuery = useGetData('userguid', '/api/v1/Users/CurrentGuid');
    const authLevel = AuthLevelInfo();
    const [charactersState, setCharactersState] = useState({
          selectedApproved: true,
          commentFilter: false,
          showApprovableOnly: false,
          viewingItem: false,
          viewItemGuid: '',
          viewItemPath: ''
      });
    const [isCreate, setIsCreate] = useState(false);
    //const [isSelect, setIsSelect] = useState(false);
    const [isEdit, setIsEdit] = useState({isEditing: false, guid: null});

    const ToggleSwitch = async (e) => {
        let toggled=charactersState[e];

        if (e === 'selectedApproved' && charactersState.showApprovableOnly) {
          await setCharactersState({
            ...charactersState,
            [e]: !toggled,
            showApprovableOnly:false
        });
        }
        else {
        await setCharactersState({
            ...charactersState,
            [e]: !toggled
        });
      }
    }   

    const DirectToCharacter = async (path, guid) => {
        setCharactersState({
            ...charactersState,
            viewingItem: true,
            viewItemGuid: guid,
            viewItemPath: path});
    }

    const GoBackToList = async () => {
      await setCharactersState({
        selectedApproved: true,
        commentFilter: false,
        showApprovableOnly: false,
        viewingItem: false,
        viewItemGuid: '',
        viewItemPath: ''
    });
    }

    const GoToEditCharacter = async (path, guid) => {
      await setIsEdit({isEditing: true, guid: guid, path: path});
    }

    const GoToSearch = async () => {
      
    }

    const NewCharacterLink = async () => {
      await setIsCreate(true);
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
{ charactersState.viewingItem === false ? 
 !isCreate ?
 !isEdit.isEditing ?
<>
<CharactersListPage appdata={approvQuery.data} 
  undata={unapprovQuery.data} 
  larpTags={allTagsQuery.data.find((tags) => tags.tagType === 'LARPRun')?.tagsList}
  tagslist={allTagsQuery.data.find((tags) => tags.tagType === 'Character')?.tagsList}
  authLevel={authLevel}
  userGuid={userGuidQuery.data}
  selectedApproved={charactersState.selectedApproved} 
  commentFilterOn={charactersState.commentFilter}
  showApprovableOnly={charactersState.showApprovableOnly}
  ToggleSwitch={() => ToggleSwitch('selectedApproved')}
  ToggleCommentSwitch={() => ToggleSwitch('commentFilter')}
  ToggleApprovableSwitch={() => ToggleSwitch('showApprovableOnly')}
  DirectToCharacter={(path, guid) => DirectToCharacter(path, guid)}
  NewCharacterLink={(e) => NewCharacterLink(e)}
  GoToSearch={() => GoToSearch()}
  Edit={(path, guid) => GoToEditCharacter(path, guid)}
  />
</>
: 
<>
<CharacterEdit authLevel={authLevel} formJSON={formJSON} tagslist={allTagsQuery.data} guid={isEdit.guid} path={isEdit.path}
GoBack ={() => GoBackFromCreateEdit()}  />
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
</>
    )
}

CharactersIndex.propTypes = {
  }