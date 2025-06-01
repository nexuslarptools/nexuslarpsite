import CharacterTable from '../../components/tables/charactertable'
import PropTypes from 'prop-types'

export default function CharactersListPage(props) {     

    return (
        <>
              <div>
    <CharacterTable 
    isSelector={false}
    FilterInit={props.FilterInit}
    UnInitFiler={() => props.UnInitFiler()}
    Filters={props.Filters}
    appdata={props.selectedApproved ? props.appdata : props.undata} 
      selectedApproved={props.selectedApproved} 
      showApprovableOnly={props.showApprovableOnly}
      readyApproved={props.readyApproved}
      commentFilterOn={props.commentFilterOn}
      larpTags={props.larpTags}
      tagslist={props.tagslist}
      userGuid={props.userGuid}
      authLevel={props.authLevel}
      DirectToCharacter={(path, guid) => props.DirectToCharacter(path, guid)}
      NewCharacterLink={(e)=> props.NewCharacterLink(e)}
      GoToSearch={() => props.GoToSearch()}
      NavToSelectItems={() => props.NavToSelectItems()}
      ToggleSwitches={(e) => props.ToggleSwitches(e)}
      Edit={(path, guid) => props.Edit(path, guid)}
      UpdateFilter={(filter) => props.UpdateFilter(filter)}
      isLoading={props.isLoading}
      />
    </div>
        </>
    )

}

CharactersListPage.propTypes = {
    DirectToCharacter: PropTypes.func,
    ToggleSwitches: PropTypes.func,
    GoToSearch: PropTypes.func,
    showApprovableOnly: PropTypes.bool,
    selectedApproved: PropTypes.bool,
    readyApproved: PropTypes.bool,
    commentFilterOn: PropTypes.bool,
    appdata: PropTypes.array,
    undata: PropTypes.array,
    authLevel: PropTypes.number,
    larpTags: PropTypes.array,
    tagslist: PropTypes.array,
    userGuid: PropTypes.string,
    NewCharacterLink: PropTypes.func,
    NavToSelectItems: PropTypes.func,
    Edit: PropTypes.func,
    UpdateFilter: PropTypes.func,
    isLoading: PropTypes.bool,
    Filters: PropTypes.object
}
