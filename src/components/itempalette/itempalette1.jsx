import PropTypes from 'prop-types';
import './_itempalette1.scss'
import ItemWrapper from '../item/itemWrapper';

export default function ItemPalette1(props)  {

    return(
<>
<div className="print-items-box1">
   <div className="item11front">
    <ItemWrapper  path={props.itemsList[1].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[1].item.guid}  item={props.itemsList[1].item} side={props.itemsList[1].side}/>
      </div>
      <div className="item12front">
    <ItemWrapper  path={props.itemsList[2].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[2].item.guid}  item={props.itemsList[2].item} side={props.itemsList[2].side}/>
      </div>
      <div className="item13front">
    <ItemWrapper  path={props.itemsList[3].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[3].item.guid}  item={props.itemsList[3].item} side={props.itemsList[3].side}/>
      </div>
      <div className="item14front">
    <ItemWrapper  path={props.itemsList[4].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[4].item.guid}  item={props.itemsList[4].item} side={props.itemsList[4].side}/>
      </div>
      <div className="item15front">
    <ItemWrapper  path={props.itemsList[5].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[5].item.guid}  item={props.itemsList[5].item} side={props.itemsList[5].side}/>
      </div>
      <div className="item16front">
    <ItemWrapper  path={props.itemsList[6].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[6].item.guid}  item={props.itemsList[6].item} side={props.itemsList[6].side}/>
      </div>
      <div className="item17front">
    <ItemWrapper  path={props.itemsList[7].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[7].item.guid}  item={props.itemsList[7].item} side={props.itemsList[7].side}/>
      </div>
      <div className="item18front">
    <ItemWrapper  path={props.itemsList[8].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[8].item.guid}  item={props.itemsList[8].item} side={props.itemsList[8].side}/>
      </div>
</div>
</>
    )
}

ItemPalette1.propTypes = {
    itemsList: PropTypes.object
  }
