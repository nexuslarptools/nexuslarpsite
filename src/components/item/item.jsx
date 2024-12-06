import PropTypes from 'prop-types';
import BasicItem from './basicitem';
import BasicItemBack from './basicitemback';
import Loading from '../../components/loading/loading';
import CompanionItem from './CompanionItem';
import CompanionItemBack from './CompanionItemBack';
import './_item.scss';
import CompanionPlaceHolderItem from './companionplaceholderitem';
import VehicleItem from './vehicleitem';
import MechaItem from './mechaitem';
import PlaceHolderItem from './placeholderitem';

const Item = props => {
    return (
        <>
        { props.item === undefined || props.item === null 
          || props.item.fields === null || props.item.fields === undefined ?
        <div className='loading-container'><Loading /></div> :
        <>
          { props.item.islarge === true && props.type === "sheet" ?
          <>            
          <div className='itemdisplay'>
          <CompanionPlaceHolderItem item={props.item} img={props.img}/> 
          </div>
          </>
          :
          props.item.isdoubleside === true && props.type === "sheet" ?
          <>            
          <div className='itemdisplay'>
          <PlaceHolderItem item={props.item} img={props.img}/> 
          </div>
          </>
          :
            props.item.fields.TYPE !== "Mecha" &&
            props.item.fields.TYPE !=="Vehicle" &&
            props.item.fields.TYPE !== "Companion" &&
            props.item.fields.TYPE !=="Pokemon" ?
            props.item.isdoubleside === true ?
            <>
            { props.side !== 'front' && props.side !== 'back' ?
            <>
            <div className='itemdisplay'>
            <BasicItem item={props.item} img={props.img}/> 
            </div>
            <div className='itemdisplay'>
            <BasicItemBack item={props.item}/> 
            </div>
            </> : props.side === 'front' ?
            <>
            <div className='itemdisplay'>
            <BasicItem item={props.item} img={props.img}/> 
            </div>
            </> : props.side === 'back' ?
            <>
            <div className='itemdisplay'>
            <BasicItemBack item={props.item}/> 
            </div>
            </> : <></>
             }   
            </>
            :
            <div className='itemdisplay'>
            <BasicItem item={props.item} img={props.img}/> 
            </div>
            :
            props.item.isdoubleside === true && props.item.fields.TYPE !=="Vehicle" && props.item.fields.TYPE !=="Mecha"  ?
            <>
            { props.side !== 'front' && props.side !== 'back' ?
            <>
            <div className='itemdisplay'>
            <CompanionItem item={props.item} img={props.img}/>
            </div>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> :
            props.side === 'front' ?
            <>
            <div className='itemdisplay'>
            <CompanionItem item={props.item} img={props.img}/>
            </div>
            </> :
            props.side === 'back' ?
            <>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> :<></>
            }
            </> : props.item.fields.TYPE !=="Vehicle" && props.item.fields.TYPE !=="Mecha"  ?
            <CompanionItem item={props.item} img={props.img}/> 
            : props.item.fields.TYPE !=="Mecha" ?
            props.item.isdoubleside === true ?
            <>
            { props.side !== 'front' && props.side !== 'back' ?
            <>
            <div className='itemdisplay'>
            <VehicleItem item={props.item} img={props.img}/>
            </div>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> : props.side === 'front' ?
            <>
            <div className='itemdisplay'>
            <VehicleItem item={props.item} img={props.img}/>
            </div>
            </> : props.side === 'back' ?
            <>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> : <></>
            }
            </>
            :
            <VehicleItem item={props.item} img={props.img}/> 
            :
            props.item.isdoubleside === true ?
            <>
            {  props.side !== 'front' && props.side !== 'back' ?
            <>
            <div className='itemdisplay'>
            <MechaItem item={props.item} img={props.img}/>
            </div>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> : props.side === 'front' ?
            <>
            <div className='itemdisplay'>
            <MechaItem item={props.item} img={props.img}/>
            </div>
            </> : props.side === 'back' ?
            <>
            <div className='itemdisplay'>
            <CompanionItemBack item={props.item}/>
            </div>
            </> : <></>
            }
            </>
           : <MechaItem item={props.item} img={props.img}/> 
          } </>
        }
        </>
    )
}

export default Item;

Item.propTypes = {
  props: PropTypes.object,
  img: PropTypes.object,
  item: PropTypes.object,
  type: PropTypes.string,
  side: PropTypes.string
}