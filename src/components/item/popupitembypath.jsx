import PropTypes from 'prop-types';
import BasicItem from './basicitem';
import Loading from '../../components/loading/loading';
import useGetData from '../../utils/getdata';

const PopupItemByPath = props => {

    const itemQuery = useGetData(props.guid, '/api/v1/' + props.path + '/' + props.guid)  

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
          { itemQuery.data .fields.TYPE !== "Mecha" &&
            itemQuery.data .fields.TYPE !=="Vehicle" &&
            itemQuery.data .fields.TYPE !== "Companion" &&
            itemQuery.data .fields.TYPE !=="Pokemon" ?
            <BasicItem item={itemQuery.data }/> :
            <div className='loading-container'><Loading /></div>
          } </>
        }
        </>
    )
}

export default PopupItemByPath;

PopupItemByPath.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  guid: PropTypes.string,
  path: PropTypes.string
}