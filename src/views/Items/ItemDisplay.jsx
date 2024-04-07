import PropTypes from 'prop-types'
import PopupItemByPath from '../../components/item/popupitembypath'

export default function ItemDisplayPage(props) {

  return (
    <>
      <PopupItemByPath guid={props.guid} path={props.path} />
      <div className="edit-bottom">
                      <button className="button-cancel" onClick={() => props.GoBackToList()}>Go Back!</button>
      </div>
    </>
  )
}

ItemDisplayPage.propTypes = {
  GoBackToList: PropTypes.func,
  guid: PropTypes.string,
  path: PropTypes.string
}