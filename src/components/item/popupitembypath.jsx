import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import useGetData from '../../utils/getdata';
import ItemWrapper from './itemWrapper';

const PopupItemByPath = props => {

    const itemQuery = useGetData(props.guid, '/api/v1/' + props.path + '/' + props.guid);

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
          { 
            <ItemWrapper path={props.path} guid={props.guid} item={itemQuery.data}/> 
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