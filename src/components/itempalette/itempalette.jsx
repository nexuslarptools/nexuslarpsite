import Item from '../item/item';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';

const ItemPalette = props => {
  if (!props || props.apiMessage == undefined) {
    return (<div className='loading-container'><Loading /></div>)
  } else if (props.apiMessage.length < 1) {
    return ( <></> )
  } else {
    return (
      <>
        <div className="print-items-box">
          {[...Array(props.apiMessage.length)].map((x, i) =>
              <>
                {
                  props.apiMessage.length > 0
                    ? <div onClick={() => props.remove(i)}>
                        <Item item={props.apiMessage[i]}/>
                      </div>
                    : <></>
                }
              </>
          )}
        </div>
      </>
    )
  }
}

export default ItemPalette;

ItemPalette.propTypes = {
  apiMessage: PropTypes.array,
  remove: PropTypes.func
}