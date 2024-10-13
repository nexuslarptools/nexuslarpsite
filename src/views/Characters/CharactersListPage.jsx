import CharacterTable from '../../components/tables/charactertable'
import PropTypes from 'prop-types'

export default function CharactersListPage(props) {     

    return (
        <>
              <div>
    <CharacterTable 
    isSelector={false}
    appdata={props.selectedApproved ? props.appdata : props.undata} 
      selectedApproved={props.selectedApproved} 
      showApprovableOnly={props.showApprovableOnly}
      commentFilterOn={props.commentFilterOn}
      larpTags={props.larpTags}
      tagslist={props.tagslist}
      userGuid={props.userGuid}
      authLevel={props.authLevel}
      DirectToCharacter={(path, guid) => props.DirectToCharacter(path, guid)}
      NewCharacterLink={(e)=> props.NewCharacterLink(e)}
      GoToSearch={() => props.GoToSearch()}
      NavToSelectItems={() => props.NavToSelectItems()}
      ToggleSwitch={() => props.ToggleSwitch()}
      ToggleCommentSwitch={() => props.ToggleCommentSwitch()}
      ToggleApprovableSwitch={() => props.ToggleApprovableSwitch()}
      Edit={(path, guid) => props.Edit(path, guid)}
      />
    </div>
        </>
    )

}

CharactersListPage.propTypes = {
    DirectToCharacter: PropTypes.func,
    ToggleSwitch: PropTypes.func,
    ToggleCommentSwitch: PropTypes.func,
    ToggleApprovableSwitch: PropTypes.func,
    GoToSearch: PropTypes.func,
    showApprovableOnly: PropTypes.bool,
    selectedApproved: PropTypes.bool,
    commentFilterOn: PropTypes.bool,
    appdata: PropTypes.array,
    undata: PropTypes.array,
    authLevel: PropTypes.number,
    larpTags: PropTypes.array,
    tagslist: PropTypes.array,
    userGuid: PropTypes.string,
    NewCharacterLink: PropTypes.func,
    NavToSelectItems: PropTypes.func,
    Edit: PropTypes.func
}
