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
            { props.item.name.length < 26 ?
              <h3 className='itemName'>{props.item.name}</h3> :
              <h3 className='itemNameSM'>{props.item.name}</h3> 
            }
            {/* <h3 className="itemName">{props.item.name}</h3> */}
            <h3 className="itemType">{props.item.fields.TYPE}</h3>
          </div>
        <div className='itemSecondSideTextBox'>
          <div className="seriesItemText">
          {props.item.back !== undefined && props.item.back !== null && 
          props.item.back.fields !== undefined && props.item.back.fields !== null &&
          props.item.back.fields.Description !== undefined && props.item.back.fields.Description !== null ?
          props.item.back.fields.Description.split('\n').map((i,key) => {
            return <div className="item-Description" key={key}><p>{
              i.split('--').map((s, j) => j % 2 !== 0 ? <><u> {s} </u></> : (' ' + s ))
              }</p></div>;
        })
            : <></>}
                          {
                  props.item.fields.Magic != null && props.item.fields.Magic != ''
                    ? <div>Magic: {props.item.fields.Magic}</div>
                    : <></>
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