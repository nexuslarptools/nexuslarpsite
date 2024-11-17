import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import useGetData from '../../utils/getdata';
import Item from './item';

const PopupItem = props => {

    const itemQuery = useGetData(props.guid, '/api/v1/ItemSheetApproveds/getlastavailable/' + props.guid)  

    if (itemQuery.isLoading) return (
        <div>
        <Loading />
        </div>)
    if (itemQuery.isError) return (
          <div>
          Error!
          </div>)

    return (
        <>
        { itemQuery.data === undefined || itemQuery.data  === null ?
        <div className='loading-container'><Loading /></div> :
           <>
            <Item item={itemQuery.data } type={props.type}/> :
           </>
        }
        </>
    )
}

export default PopupItem;

PopupItem.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  guid: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string
}