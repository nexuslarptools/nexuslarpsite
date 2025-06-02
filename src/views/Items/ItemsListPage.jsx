import ItemTable from '../../components/tables/itemtable'
import PropTypes from 'prop-types'

export default function ItemsListPage(props) {     

return (
<>
  <div>
       <ItemTable 
    isSelector={false}
    Filters={props.Filters}
    appdata={props.selectedApproved ? props.appdata : props.undata} 
      selectedItemsApproved={props.selectedApproved} 
      showApprovableOnly={props.showApprovableOnly}
      commentFilterOn={props.commentFilterOn}
      readyApproved={props.readyApproved}
      larpTags={props.larpTags}
      tagslist={props.tagslist}
      userGuid={props.userGuid}
      authLevel={props.authLevel}
      DirectToItem={(path, guid) => props.DirectToItem(path, guid)}
      NewItemLink={(e)=> props.NewItemLink(e)}
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

ItemsListPage.propTypes = {
  DirectToItem: PropTypes.func,
  ToggleSwitches: PropTypes.func,
  showApprovableOnly: PropTypes.bool,
  selectedApproved: PropTypes.bool,
  commentFilterOn: PropTypes.bool,
  readyApproved: PropTypes.bool,
  appdata: PropTypes.object,
  undata: PropTypes.object,
  authLevel: PropTypes.number,
  larpTags: PropTypes.array,
  tagslist: PropTypes.array,
  userGuid: PropTypes.string,
  NewItemLink: PropTypes.func,
  NavToSelectItems: PropTypes.func,
  Edit: PropTypes.func,
  UpdateFilter: PropTypes.func,
  isLoading: PropTypes.bool,
  Filters: PropTypes.object
}