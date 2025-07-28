import PropTypes from 'prop-types';

const Startingitems = props => {

    let iteminfolen = 0;

    if (props.iteminfo !== undefined 
        && props.iteminfo !== null
        && props.iteminfo !== '') {
            iteminfolen = props.iteminfo.length;
        }

    if (props.itemList.length > 0 ) {
        props.itemList.forEach((item) => {
            iteminfolen += item.itemName.length;
            if ( item.total > 1 ) {
                iteminfolen += 5;
            }
        });
    }
    else {
        iteminfolen = 17;
    }

    return (
        iteminfolen > 100
        ?  <div className='starting-items-list-sm'>
        {props.iteminfo !== undefined 
         && props.iteminfo !== null
         && props.iteminfo !== '' ? 
         props.iteminfo + " " : null
         }
       {props.itemList.length > 0 ? props.itemList.map((item, i) => 
           i + 1 === props.itemList.length
             ? item.itemName
             :  item.total > 1
             ?  item.itemName + ' (' + item.total + '),  '
               : item.itemName + ',  '
         ) :
            (props.iteminfo !== undefined 
         && props.iteminfo !== null
         && props.iteminfo !== '' ? null : 
         'No Starting Items')
         }
       </div> :
       <div className='starting-items-list'>
                           {props.iteminfo !== undefined 
         && props.iteminfo !== null
         && props.iteminfo !== '' ? 
         props.iteminfo + " " : null
         }
       {props.itemList.length > 0 ? props.itemList.map((item, i) => 
           i + 1 === props.itemList.length
             ? item.itemName
             :  item.total > 1
             ?  item.itemName + ' (' + item.total + '),  '
               : item.itemName + ',  '
         ) :
            (props.iteminfo !== undefined 
         && props.iteminfo !== null
         && props.iteminfo !== '' ? null : 
         'No Starting Items')
         }
        </div>
    )

}
export default Startingitems;

Startingitems.propTypes = {
  itemList: PropTypes.array,
  iteminfo: PropTypes.string
}