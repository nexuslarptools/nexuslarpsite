import PropTypes from "prop-types";
import ItemPalette0 from "./itempalette0";
import ItemPalette1 from "./itempalette1";
import ItemPalette0Back from "./itempalette0back";
import ItemPalette1Back from "./itempalette1back";
import blankitemJSON from '../../jsonfiles/smallitemfill.json';
import blanklargeitembackJSON from '../../jsonfiles/largeitembackfill.json';
import ItemPalette2Back from "./itempalette2back";
import ItemPalette2 from "./itempalette2";
import ShipItem from "../item/shipitem";
import Item from "../item/item";
import ItemWrapper from "../item/itemWrapper";

const ItemPaletteWrapper = props => {

    if ((props.itemsList === undefined || props.itemsList === null
        ||  props.itemsList.length <= 0)&&(props.itemsList2 === undefined ||
        props.itemsList2 === null  || props.itemsList2.length <= 0)) {
        return (
            <>
            </>
        )
    }
    
    let fullItemList = [];

    if (props.itemsList !== undefined && props.itemsList2 !== undefined)
    {
        fullItemList = props.itemsList.concat(props.itemsList2);
    }
    else if (props.itemsList !== undefined) {
        fullItemList = props.itemsList;
    }  
    else {
        fullItemList = props.itemsList2;
    }




    let largeitemList = [];
    let smallitemList = [];
    let shipitemList= [];
    let itemPages=[];

    function smallAllowed(largeTotal) {
        switch(largeTotal) {
            case 0:
              return 9;
            case 1:
              return 8;
            case 2:
              return 7;
            case 3:
              return 7;
            case 4:
             return 7;
            default:
             return 7;
          }
    }

    function smallFrontBackAllowed(largeTotal, currentslot) {
        switch(largeTotal) {
            case 0:
                switch(currentslot) {
                    case 1:
                    return true;
                    case 2:
                    return true;
                    case 4:
                    return true;
                    case 5:
                      return true;
                    case 7:
                      return true;
                    case 8:
                        return true;
                    default:
                        return false;
                }
            case 1:
                switch(currentslot) {
                    case 3:
                    return true;
                    case 5:
                    return true;
                    case 7:
                    return true;
                    default:
                        return false;
                }
            case 2:
                switch(currentslot) {
                    case 5:
                    return true;
                    case 6:
                    return true;
                    default:
                        return false;
                }
            case 3:
                switch(currentslot) {
                    case 6:
                    return true;
                    default:
                        return false;
                }
            case 4:
             return false;
            default:
             return false;
        }
    }

    function addpage(pagenumber, side) {
        let page = {
           page: pagenumber,
           pageType: 0,
           side: side,
           items: {
            1: null,
            2: null ,
            3: null,
            4: null,
            5: null,
            6: null,
            7: null,
            8: null,
            9: null
           }
        };
        return page;
    }

    function addshippage(pagenumber) {
        let page = {
           page: pagenumber,
           pageType: 5,
           items: {
            1: null
           }
        };
        return page;
    }



    function addItemSide(item, size, frontorback) {
        if (item != null) {
        return {
            item: item,
            side: frontorback
        }
    }
    if (size === 'small'){    
        return {
          item: blankitemJSON,
          side: frontorback
      }
    }
    return {
        item: blanklargeitembackJSON,
        side: frontorback
    }}

    function findNextPageSlot(page, type, isdoubleside) {
        if (type === 'large') {
          for (let slotnumber = 1; slotnumber <= 4; slotnumber++) {
                if (page.items[slotnumber] === null) {
                   if (props.printfrontback) {
                       return slotnumber;
                    }

                    if (isdoubleside === false || (isdoubleside === true && (slotnumber === 1 || slotnumber === 3)))
                    {
                        return slotnumber;
                    }
                }
            }
        }
        else {
            for (let slotnumber = 1; slotnumber <= smallAllowed(page.pageType); slotnumber++) {
                if (page.items[slotnumber] === null) {
                       if (props.printfrontback) {
                           return slotnumber;
                        }
                        if(isdoubleside === false || smallFrontBackAllowed(page.pageType, slotnumber)) {
                            return slotnumber;
                        }
                    }
                }
            }
            return null;
        }


        fullItemList.forEach(item => {
        if (item !== null && item.islarge !== undefined && item.islarge 
            && item.fields.TYPE  !== 'Ship') {
            largeitemList.push(item);
        }
        else if (item.fields.TYPE  !== 'Ship') {
          if (item !== null) {
              smallitemList.push(item);
          }
        }
        else {
           if (item !== null) {
              shipitemList.push(item);
          }
        }  
    });

    let newpage = addpage(0, 'front');
    let newpageback = addpage(1, 'back');
    
    let pageNum = 0;
    if (props.printfrontback && largeitemList.length > 0) {
        itemPages.push(newpage);
        itemPages.push(newpageback);
    largeitemList.forEach(largeitem => {
        let slotnum = findNextPageSlot(itemPages[pageNum], 'large', largeitem.isdoubleside);
        if (slotnum === null) {
            pageNum = pageNum + 2
            let newpage = addpage(pageNum, 'front');
            newpage.items[1] = addItemSide(largeitem, 'large', 'front');
            newpage.pageType = newpage.pageType + 1;
            let newpageback = addpage(pageNum+1, 'back');
            if(largeitem.isdoubleside) {
              newpageback.items[1] = addItemSide(largeitem, 'large', 'back');
            }
            else {
              newpageback.items[1] = addItemSide(null, 'large', 'back');
            }
            newpageback.pageType = newpageback.pageType + 1;
            itemPages.push(newpage);
            itemPages.push(newpageback);
        }
        else {
            itemPages[pageNum].items[slotnum]= addItemSide(largeitem, 'large', 'front');
            itemPages[pageNum].pageType = itemPages[pageNum].pageType + 1;
            if(largeitem.isdoubleside) {
                itemPages[pageNum+1].items[slotnum]= addItemSide(largeitem, 'large', 'back');
              }
              else {
                itemPages[pageNum+1].items[slotnum]= addItemSide(null, 'large', 'back');
              }
            itemPages[pageNum+1].pageType = itemPages[pageNum+1].pageType + 1;
        }
    });
  }

else if (largeitemList.length > 0) {
    itemPages.push(newpage);
    largeitemList.forEach(largeitem => {
        let slotnum = findNextPageSlot(itemPages[pageNum], 'large', largeitem.isdoubleside);
        if (slotnum === null) {
            pageNum = pageNum + 1
            let newpage = addpage(pageNum, 'front');
            newpage.items[1] = addItemSide(largeitem, 'large', 'front');
            newpage.pageType = newpage.pageType + 1;
            if (largeitem.isdoubleside === true) {
                newpage.items[2] = addItemSide(largeitem, 'large', 'back');
                newpage.pageType = newpage.pageType + 1;
            }
            itemPages.push(newpage);
        }
        else {
            itemPages[pageNum].items[slotnum]= addItemSide(largeitem, 'large', 'front');
            itemPages[pageNum].pageType = itemPages[pageNum].pageType + 1;
            if ( largeitem.isdoubleside === true) {
              itemPages[pageNum].items[slotnum+1]= addItemSide(largeitem, 'large', 'back');
              itemPages[pageNum].pageType = itemPages[pageNum].pageType + 1;
            }
        }
    });
  }





  if (props.printfrontback && smallitemList.length > 0) {
smallitemList.forEach(smallitem => {
    let slotnum = null
    for (pageNum = 0; pageNum < itemPages.length; pageNum = pageNum + 2) {
    slotnum = findNextPageSlot(itemPages[pageNum], 'small', smallitem.isdoubleside);
      if (slotnum !== null) {
          break;
      }
    }
    if (slotnum === null) {
        pageNum = pageNum + 2
        let newpage = addpage(pageNum,'front');
        newpage.items[1] = addItemSide(smallitem, 'small', 'front');
        let newpageback = addpage(pageNum+1,'back');
        if (smallitem.isdoubleside === true) {
          newpageback.items[1] = addItemSide(smallitem, 'small', 'back');
        }
        itemPages.push(newpage);
        itemPages.push(newpageback);
    }
    else {
        itemPages[pageNum].items[slotnum]= addItemSide(smallitem, 'small', 'front');
        if ( smallitem.isdoubleside === true) {
          itemPages[pageNum+1].items[slotnum]= addItemSide(smallitem, 'small', 'back');
        }
    }
});
}
else if (smallitemList.length > 0) {
  smallitemList.forEach(smallitem => {
    let slotnum = null
    for (pageNum = 0; pageNum < itemPages.length; pageNum++) {
    slotnum = findNextPageSlot(itemPages[pageNum], 'small', smallitem.isdoubleside);
    if (slotnum !== null) {
        break;
    }
    }
    if (slotnum === null) {
        pageNum = pageNum + 1
        let newpage = addpage(pageNum,'front');
        newpage.items[1] = addItemSide(smallitem, 'small', 'front');
        if (smallitem.isdoubleside === true) {
            newpage.items[2] = addItemSide(smallitem, 'small', 'back');
        }
        itemPages.push(newpage);
    }
    else {
        itemPages[pageNum].items[slotnum]= addItemSide(smallitem, 'small', 'front');
        if ( smallitem.isdoubleside === true) {
          itemPages[pageNum].items[slotnum+1]= addItemSide(smallitem, 'small', 'back');
        }
    }
});
}

if (shipitemList.length > 0) {
    shipitemList.forEach(ship => {
     let newpage = addshippage(pageNum);
     newpage.items[0] = addItemSide(ship, 'ship', 'front');
     itemPages.push(newpage);
     pageNum++;
    });
}

itemPages.forEach(page => {
    for (let i = 1; i <= 9; i++) {
        if (page.items[i] === null)
        {
            page.items[i] = addItemSide(null, 'small', page.side);
        }
    }
});


    return(
        <>
       { itemPages.map((page, index) => 
       page.pageType === 5 ?
        <div key={index}>
        <ItemWrapper path={page.items[0].item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
      guid={page.items[0].item.guid}  item={page.items[0].item} side={page.items[0].side} />
        </div>
       :
        page.pageType === 0 && page.side ==='back' ?
        <div key={index}>
        <ItemPalette0Back itemsList={page.items} />
        </div> :  page.pageType === 0 ?
       <div key={index}>
       <ItemPalette0 itemsList={page.items} />
       </div> : 
        page.pageType === 1 && page.side ==='back' ?
        <div key={index}>
        <ItemPalette1Back itemsList={page.items} />
        </div> :
         page.pageType === 1 ?
        <div key={index}>
        <ItemPalette1 itemsList={page.items} />
        </div> : 
        page.pageType === 2 && page.side ==='back' ?
         <div key={index}>
        <ItemPalette2Back itemsList={page.items} type={page.pageType}  />
         </div> : 
        page.pageType === 3 && page.side ==='back' ?
        <div key={index}>
       <ItemPalette2Back itemsList={page.items} type={page.pageType}  />
        </div> : 
      page.pageType === 4 && page.side ==='back' ?
        <div key={index}>
        <ItemPalette2Back itemsList={page.items} type={page.pageType}  />
        </div> : 
        <div key={index}>
        <ItemPalette2 itemsList={page.items} type={page.pageType}  />
        </div> 
         )}
        </>
    )
}

export default ItemPaletteWrapper;

ItemPaletteWrapper.propTypes = {
    itemsList: PropTypes.array,
    itemsList2: PropTypes.array,
    fullItems: PropTypes.array,
    printfrontback: PropTypes.bool
}