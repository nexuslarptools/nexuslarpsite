import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import ItemTable from "../tables/itemtable";
import ItemSelectonList from "./itemslectionlist";
import { Box, Grid, Stack } from "@mui/material";

const ItemSelector = (props) => {

    const [itemListState, setItemListState] = useState([]);

    useEffect(() => {
        const newItemList=[]
        if (props.initialItems.label !== 'Selection for Printing') {
        if (props.initialItems !== undefined && props.initialItems !== null)
        if (props.initialItems.label === 'Sheet Item' && props.initialItems.sheetItemGuid !== '') {
          const founditem = props.appdata.iteList.find((item) => item.guid === props.initialItems.sheetItemGuid);
          const newitem = {
            name: props.initialItems.sheetItem,
            count: 1,
            guid: props.initialItems.sheetItemGuid,
            path: founditem !== undefined && founditem !== null ? 'ItemSheetApproveds' : 'ItemSheets'
        };
        newItemList.push(newitem);
        } 
        else if (props.initialItems.label === 'Upgrade Items') {
          for (let i = 0; i < props.initialItems.upgradeItemGuids.length; i++) {
              const founditem = props.appdata.iteList.find((item) => item.guid === props.initialItems.upgradeItemGuids[i]);
              const existitem = newItemList.find((item) => item.guid === props.initialItems.upgradeItemGuids[i]);
  
              if (existitem !== undefined && existitem !== null) {
                  existitem.count++;
              }
              else {
              const newitem = {
                  name: props.initialItems.upgradeItems[i],
                  count: 1,
                  guid: props.initialItems.upgradeItemGuids[i],
                  path: founditem !== undefined && founditem !== null ? 'ItemSheetApproveds' : 'ItemSheets'
              };
              newItemList.push(newitem);
          }
          }
        }
        else {
        for (let i = 0; i < props.initialItems.startingItemGuids.length; i++) {
            const founditem = props.appdata.iteList.find((item) => item.guid === props.initialItems.startingItemGuids[i]);
            const existitem = newItemList.find((item) => item.guid === props.initialItems.startingItemGuids[i]);

            if (existitem !== undefined && existitem !== null) {
                existitem.count++;
            }
            else {
            const newitem = {
                name: props.initialItems.startingItems[i],
                count: 1,
                guid: props.initialItems.startingItemGuids[i],
                path: founditem !== undefined && founditem !== null ? 'ItemSheetApproveds' : 'ItemSheets'
            };
            newItemList.push(newitem);
        }
        }
      }
      }
        setItemListState(newItemList);
      }, [props.initialItems.show])

    const AddItemToList = async (path, guid) => {
        let founditem = null;
        if (props.selectedApproved) {
            founditem = props.appdata.iteList.find((item) => item.guid === guid);
        }
        else {
            founditem = props.undata.iteList.find((item) => item.guid === guid);
        }
        const newItemList = [];
        if (founditem !== null) {
          if (props.initialItems.label === 'Sheet Item') {
            const newitem =             {
              name: founditem.name,
              count: 1,
              guid: founditem.guid,
              path: props.selectedApproved ? 'ItemSheetApproveds' : 'ItemSheets'
          };
          newItemList.push(newitem);
          }
          else {
          let wasfound =false;
          
          itemListState.forEach(item => {
            if (item.guid === founditem.guid && ((props.selectedApproved && item.path === 'ItemSheetApproveds') || 
                !props.selectedApproved && item.path === 'ItemSheets')) {
                item.count++;
                wasfound=true;
            }
            newItemList.push(item);
          })
          if(!wasfound) {
            const newitem =             {
                name: founditem.name,
                count: 1,
                guid: founditem.guid,
                path: props.selectedApproved ? 'ItemSheetApproveds' : 'ItemSheets'
            };
            newItemList.push(newitem);
          }
        }
          setItemListState(newItemList);
          props.UpdateItemList(newItemList);
        }
    }

    const RemItemFromList = async (guid) => {
        const newItemList = [];
        itemListState.forEach(item => {
          if (item.guid !== guid) {
          newItemList.push(item);
          }
        })
        setItemListState(newItemList);
        props.UpdateItemList(newItemList);
    }

    const IncreaseCount = async (guid) => {
        const newItemList = [];
        itemListState.forEach(item => {
          if (item.guid === guid) {
            item.count++;
          }
          newItemList.push(item);
        })
        setItemListState(newItemList);
        props.UpdateItemList(newItemList);
    }

    const LowerCount = async (guid) => {
        const newItemList = [];
        itemListState.forEach(item => {
          if (item.guid === guid) {
            item.count--;
          }
          newItemList.push(item);
        })
        setItemListState(newItemList);
        props.UpdateItemList(newItemList);
    }

    return (
    <>
    <div className="splitScreen">
    <Stack direction='row'>
      {/* <Box> */}
      <div className="topPane">
      <ItemTable 
      isSelector={true}
      isCharSheet={props.isCharSheet}
      appdata={props.selectedApproved ? props.appdata : props.undata} 
      selectedItemsApproved={props.selectedApproved} 
      showApprovableOnly={props.showApprovableOnly}
      commentFilterOn={props.commentFilterOn}
      larpTags={props.larpTags}
      tagslist={props.tagslist}
      userGuid={props.userGuid}
      authLevel={props.authLevel}
      DirectToItem={(path, guid) => AddItemToList(path, guid)}
      NewItemLink={(e)=> props.NewItemLink(e)}
      NavToSelectItems={() => props.NavToSelectItems()}
      ToggleSwitch={() => props.ToggleSwitch()}
      ToggleCommentSwitch={() => props.ToggleCommentSwitch()}
      ToggleApprovableSwitch={() => props.ToggleApprovableSwitch()}
      GoBack={() => props.GoBack()}
      />
      </div>
{/*       </Box>*/}
{/*   <Box > */}
      <div className="bottomPane">
        <div className="selectionlist-label">
          {props.initialItems.label}
        </div>
        <div className="selectionlist-list">
        <ItemSelectonList List={itemListState} 
        allowMultiples={props.initialItems.label !== 'Sheet Item'}
        RemoveItem={(guid) => RemItemFromList(guid)}
        IncreaseCount={(guid) => IncreaseCount(guid)} 
        LowerCount={(guid) => LowerCount(guid)}
        />
        </div>
   </div>
   {/* </Box> */}
   </Stack>
</div>
    </>
    )
}

export default ItemSelector;

ItemSelector.propTypes = {
    DirectToItem: PropTypes.func,
    ToggleSwitch: PropTypes.func,
    ToggleCommentSwitch: PropTypes.func,
    ToggleApprovableSwitch: PropTypes.func,
    showApprovableOnly: PropTypes.bool,
    selectedApproved: PropTypes.bool,
    commentFilterOn: PropTypes.bool,
    isCharSheet: PropTypes.bool,
    appdata: PropTypes.object,
    undata: PropTypes.object,
    authLevel: PropTypes.number,
    larpTags: PropTypes.array,
    tagslist: PropTypes.array,
    initialItems: PropTypes.object,
    userGuid: PropTypes.string,
    NewItemLink: PropTypes.func,
    NavToSelectItems: PropTypes.func,
    Edit: PropTypes.func,
    GoBack: PropTypes.func,
    UpdateItemList: PropTypes.func
}