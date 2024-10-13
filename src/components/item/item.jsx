import PropTypes from 'prop-types';
import BasicItem from './basicitem';
import BasicItemBack from './basicitemback';
import Loading from '../../components/loading/loading';
import CompanionItem from './CompanionItem';
import CompanionItemBack from './CompanionItemBack';
import './_item.scss';

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
            props.item.isdoubleside === true ?
            <>
            <div className='itemdisplay'>
            <BasicItem item={props.item}/> 
            </div>
            <div className='itemdisplay'>
            <BasicItemBack item={props.item}/> 
            </div>
            </>
            :
            <BasicItem item={props.item}/> 
            :
            props.item.isdoubleside === true ?
            <>
            <div className='itemdisplay'>
            <CompanionItem item={props.item}/>
            </div>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> :
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