import PropTypes from 'prop-types';
import Item from './item';
import Loading from '../../components/loading/loading';
import usePresignedImgQuery from '../../hooks/usePresignedImgQuery';
const ItemWrapper = props => {

    const imgUrl = usePresignedImgQuery('images/Items/' + props.guid +'.jpg', (props.path === 'UnApproved' || props.path === 'ItemSheets' 
      || props.item === undefined || props.item === null ? null : props.item.img1 ));

    if (imgUrl.isLoading) return (
        <div>
        <Loading />
        </div>)
    if (imgUrl.error !== null) return (
          <div>
          Error!
          </div>)

    return (
        <>
          <Item item={props.item} img={imgUrl.url} type={props.type} side={props.side}/> 
        </>
    )
}

export default ItemWrapper;

ItemWrapper.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  guid: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string,
  side: PropTypes.string
}