import PropTypes from 'prop-types';
import './_itempalette2.scss'
import ItemWrapper from '../item/itemWrapper';

export default function ItemPalette2(props)  {

    return(
<>
<div className="print-items-box1">
    { props.itemsList[1] !== null ?
   <div className={"item"+props.type+"1front"}>
    <ItemWrapper  path={props.itemsList[1].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[1].item.guid}  item={props.itemsList[1].item} side={props.itemsList[1].side}/>
      </div> : <></>
    }
        { props.itemsList[2] !== null ?
   <div className={"item"+props.type+"2front"}>
    <ItemWrapper  path={props.itemsList[2].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[2].item.guid}  item={props.itemsList[2].item} side={props.itemsList[2].side}/>
      </div> : <></>
    }
        { props.itemsList[3] !== null ?
   <div className={"item"+props.type+"3front"}>
    <ItemWrapper  path={props.itemsList[3].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[3].item.guid}  item={props.itemsList[3].item} side={props.itemsList[3].side}/>
      </div> : <></>
    }
        { props.itemsList[4] !== null ?
   <div className={"item"+props.type+"4front"}>
    <ItemWrapper  path={props.itemsList[4].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[4].item.guid}  item={props.itemsList[4].item} side={props.itemsList[4].side}/>
      </div> : <></>
    }
      { props.itemsList[5] !== null ?
     <div className={"item"+props.type+"5front"}>
    <ItemWrapper  path={props.itemsList[5].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[5].item.guid}  item={props.itemsList[5].item} side={props.itemsList[5].side}/>
      </div> : <></>
    }
    { props.itemsList[6] !== null ?
   <div className={"item"+props.type+"6front"}>
    <ItemWrapper  path={props.itemsList[6].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[6].item.guid}  item={props.itemsList[6].item} side={props.itemsList[6].side}/>
      </div> : <></>
    }
        { props.itemsList[7] !== null ?
      <div className={"item"+props.type+"7front"}>
    <ItemWrapper  path={props.itemsList[7].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={props.itemsList[7].item.guid}  item={props.itemsList[7].item} side={props.itemsList[7].side}/>
      </div> : <></>
    }
</div>
</>
    )
}

ItemPalette2.propTypes = {
    itemsList: PropTypes.object,
    type: PropTypes.int
  }
