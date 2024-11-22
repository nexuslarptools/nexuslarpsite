import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import './_itempalette.scss'
import ItemWrapper from '../item/itemWrapper';

const ItemPalette = props => {

  const groupedItems = props.apiMessage.reduce(
    (acc, item) => {
      if (acc[acc.length - 1].length >= 3) {
        return [...acc, [item]];
      }
      acc[acc.length - 1].push(item);
      return acc;
    },
    [[]]
  );

  if (!props || props.apiMessage == undefined) {
    return (<div className='loading-container'><Loading /></div>)
  } else if (props.apiMessage.length < 1) {
    return ( <></> )
  } else {
    return (
      <>
        <div className="print-items-box">
        {[...Array(groupedItems.length)].map((y, j) =>
        <>
        <div className="print-items-column">
          {[...Array(groupedItems[j].length)].map((x, i) =>
              <>
                {
                  groupedItems[j].length > 0
                    ? <div>
                        <ItemWrapper  path={groupedItems[j][i].secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
                          guid={groupedItems[j][i].guid}  item={groupedItems[j][i]}/>
                      </div>
                    : <></>
                }
              </>
          )}
          </div>
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