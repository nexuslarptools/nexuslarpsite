import PropTypes from 'prop-types';
import './_itempalette0.scss'
import ItemWrapper from '../item/itemWrapper';

export default function ItemPalette0Back(props)  {
    return(
<>
<div className="print-items-box1">
    {props.itemsList[1] !== null ?
    <div className="item01back">
    <ItemWrapper  path={props.itemsList[1].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[1].item.guid}  item={props.itemsList[1].item} side={props.itemsList[1].side}/>
    </div> : <></>}
    {props.itemsList[2] !== null ?
    <div className="item02back">
    <ItemWrapper  path={props.itemsList[2].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[2].item.guid}  item={props.itemsList[2].item} side={props.itemsList[2].side}/>
    </div> : <></>}
    {props.itemsList[3] !== null ?
    <div className="item03back">
    <ItemWrapper  path={props.itemsList[3].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[3].item.guid}  item={props.itemsList[3].item} side={props.itemsList[3].side}/>
    </div> : <></>}
    {props.itemsList[4] !== null ?
    <div className="item04back">
    <ItemWrapper  path={props.itemsList[4].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[4].item.guid}  item={props.itemsList[4].item} side={props.itemsList[4].side}/>
    </div> : <></>}
    {props.itemsList[5] !== null ?
    <div className="item05back">
    <ItemWrapper  path={props.itemsList[5].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[5].item.guid}  item={props.itemsList[5].item} side={props.itemsList[5].side}/>
    </div>: <></>}
    {props.itemsList[6] !== null ?
    <div className="item06back">
    <ItemWrapper  path={props.itemsList[6].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[6].item.guid}  item={props.itemsList[6].item} side={props.itemsList[6].side}/>
    </div>: <></>}
    {props.itemsList[7] !== null ?
    <div className="item07back">
    <ItemWrapper  path={props.itemsList[7].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[7].item.guid}  item={props.itemsList[7].item} side={props.itemsList[7].side}/>
    </div>: <></>}
    {props.itemsList[8] !== null ?
    <div className="item08back">
    <ItemWrapper  path={props.itemsList[8].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[8].item.guid}  item={props.itemsList[8].item} side={props.itemsList[8].side}/>
    </div> : <></>}
    {props.itemsList[9] !== null ?
    <div className="item09back">
    <ItemWrapper  path={props.itemsList[9].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[9].item.guid}  item={props.itemsList[9].item} side={props.itemsList[9].side}/>
    </div> : <></>}
</div>
</>
    )
}
ItemPalette0Back.propTypes = {
    itemsList: PropTypes.object
  }
