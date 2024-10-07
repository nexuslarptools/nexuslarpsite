import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';

const BasicItemBack = props => {

  if (!props || !props.item) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
    <>
      <div className="seriesItemBox">
      <div className='itemTitleBox'>
            <h3 className="itemName">{props.item.fields.Name}</h3>
            <h3 className="itemType">{props.item.fields.TYPE}</h3>
          </div>
        <div className='itemSecondSideTextBox'>
          <div className="seriesItemText">
          {props.item.back.fields.Description !== undefined && props.item.back.fields.Description !== null ?
          props.item.back.fields.Description.split("\n").map((i,key) => {
            return <div className="item-description" key={key}>{i}</div>;
        }) :
        <div> </div>
              }
          </div>
        </div>
      </div>
    </>
    )
  }
}

export default BasicItemBack;

BasicItemBack.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object
}