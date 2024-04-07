import PropTypes from 'prop-types';
import BasicItem from './basicitem';
import Loading from '../../components/loading/loading';
import CompanionItem from './CompanionItem';

const Item = props => {
    return (
        <>
        { props.item === undefined || props.item === null ?
        <div className='loading-container'><Loading /></div> :
        <>
          { props.item.fields.TYPE !== "Mecha" &&
            props.item.fields.TYPE !=="Vehicle" &&
            props.item.fields.TYPE !== "Companion" &&
            props.item.fields.TYPE !=="Pokemon" ?
            <BasicItem item={props.item}/> :
            <CompanionItem item={props.item}/>
          } </>
        }
        </>
    )
}

export default Item;

Item.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object
}