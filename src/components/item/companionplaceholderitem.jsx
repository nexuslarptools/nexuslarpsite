
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import './_item.scss'

const CompanionPlaceHolderItem = props => {

  if (!props || !props.item) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
    <>
      <div className="seriesItemBox">
        <div className="seriesItem">
          <div className='itemTitleBox'>
            <h3 className="itemName">{props.item.name}</h3>
            <h3 className="itemType">{props.item.fields.TYPE}</h3>
          </div>
          <div className='itemPicBox'>
                <img className="itemPic" src={props.img} alt={''} />
          </div>
          <div className='itemTextBox'>
            <div className="seriesItemText">
<>
Please see the main item card for full stats.
</>
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
}

export default CompanionPlaceHolderItem;

CompanionPlaceHolderItem.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  img: PropTypes.string
}