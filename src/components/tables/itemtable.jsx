//import React from 'react'
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import { Autocomplete, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, 
  MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, 
  TablePagination, TableRow, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import './table.scss';
import { Clear } from '@mui/icons-material';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp'
import FastRewindSharpIcon from '@mui/icons-material/FastRewindSharp';
import { useState, useEffect } from 'react';
import Tags from '../tags/tags';
import FilterIcon from '../icon/filtericon';
import KickDialog from '../dialogs/kickdialogbox';
import DeleteSanityDialog from '../dialogs/deletesanitydialog';
import HoverText from '../hovertext/hovertext';
import './_itemtable.scss'


const ItemTable = props => {


  const [displayState, setDisplayState] = useState({
    apimessage: '',
    display: false
  });
  const [tagState, setTagState] = useState({
    listTags: []
  });
  const [filterState, setFilterState] = useState({
    SeriesFilter: '',
    ItemsFilter: '',
    EditorFilter: '',
    CreatorFilter: ''
  });
  const [clearfilterState, setClearfilterState] = useState(false);
  const [selectedLarpTag, setSelectedLarpTag] = useState(null);
  const [tagSelectValues, setTagSelectValues] = useState([]);
  const [selectedApprovalState, setSelectedApprovalState] = useState('');
  const [autocompSelectedValue, setAutocompSelectedValue] = useState(null);
  const [resetInputField, setResetInputField] = useState(false);
  const [larpAutoCompValue, setLarpAutoCompValue] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentTagList, setCurrentTagList] = useState([]);
  const [btnDisabledState, setBtnDisabledState] = useState(true);

  const [fullDeleteDialogOpen, setFullDeleteDialogOpen] = useState({
    row: null,
    open: false
  });
  const [kickDialogOpen, setKickDialogOpen] = useState({
    open: false,
    row: null
  });

  
  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  
  useEffect(() => {

    let tagDrowdownList = [];
    props.tagslist.forEach(tag => {
      if (tag.tagtypeguid === '26cdc31c-9401-11ea-899b-b3284e6703b8') {
        tagDrowdownList.push(tag);
      }
    });

    if (selectedLarpTag !== null) {
      const fullSelectLARPTag = props.larpTags.find((tag) => tag.guid === selectedLarpTag);
      tagDrowdownList.push(fullSelectLARPTag);
    }
    setCurrentTagList(tagDrowdownList);

    let filteredRows = props.appdata?.iteList;

    filteredRows = filteredRows.filter(item => removeDiacritics(item.name.toLocaleLowerCase()).includes(removeDiacritics(filterState.ItemsFilter.toLocaleLowerCase())));
    filteredRows = filteredRows.filter(item => (item.series === null && filterState.SeriesFilter === '') || 
       (item.series !== null && removeDiacritics(item.series.toLocaleLowerCase()).includes(removeDiacritics(filterState.SeriesFilter.toLocaleLowerCase()))));
    filteredRows = filteredRows.filter(item => removeDiacritics(item.createdby.toLocaleLowerCase()).includes(removeDiacritics(filterState.CreatorFilter.toLocaleLowerCase())));
    filteredRows = filteredRows.filter(item => removeDiacritics(item.editbyUser.toLocaleLowerCase()).includes(removeDiacritics(filterState.EditorFilter.toLocaleLowerCase())));
   
    if (props.showApprovableOnly) {
      filteredRows = filteredRows.filter(item => (item.editbyUserGuid !== props.userGuid && item.firstapprovalbyuserGuid !== props.userGuid));
    }
    if (props.readyApproved) {
      filteredRows = filteredRows.filter(item => item.readyforapproval === true);
    }

    if (selectedApprovalState === 'U')
    {
      filteredRows = filteredRows.filter(character => (character.firstapprovalbyuserGuid === null ));
    }

    if (selectedApprovalState === '1')
    {
      filteredRows = filteredRows.filter(character => (character.firstapprovalbyuserGuid !== null ));
    }

    if (tagState.listTags.length > 0 || props.larpTags.length > 0) {
      const newfilter = [];
      filteredRows.forEach((row) => {
        if (row.tags !== null) {
            const listguids = []
            row.tags.forEach((tag) => {
              listguids.push(tag.guid);
            })
            if (listguids.length === 0 || props.larpTags.every(elem => !listguids.includes(elem.guid)) ||
            listguids.includes(selectedLarpTag)) {
              if (tagState.listTags.every(elem => listguids.includes(elem))) {
                newfilter.push(row);
              }
            }
        }
      })
      filteredRows = newfilter;
    }

    if (props.commentFilterOn === true) {
      filteredRows = filteredRows.filter(character => (character.hasreview === true ));
    }

    const filteredrowstotal = filteredRows.length;
    const filteredPageRows = filteredRows.filter((series, index) => index >= (rowsPerPage * (page)) && index < (rowsPerPage * (page + 1)));

    setDisplayState({
      ...displayState,
      apimessage: filteredPageRows,
      totalrows: filteredrowstotal,
      display: true
    })
  }, [props.appdata, props.showallLARPLinked, props.showApprovableOnly, props.readyApproved,  props.commentFilterOn,
    filterState, tagState, selectedLarpTag, selectedApprovalState, page, rowsPerPage]);



  const UpdateApprovalFilter = async (e) => {
    setSelectedApprovalState(e.target.value);
  }

  const UpdateLarpAutoComp =(e) => {
    setLarpAutoCompValue(e);
    if (e === '')
    {
      setResetInputField(true);
      selectLarpTag(null);
      setAutocompSelectedValue(null);
      setResetInputField(false);
    }
  }

  const selectLarpTag = async (e) => {
    if (e !== null) {
    setAutocompSelectedValue(e.name);
    setLarpAutoCompValue(e.name);
    }

    if (e === undefined || e === null) {
      setLarpAutoCompValue('');
      let newTagFilter = [];

      tagSelectValues.forEach(tag => {
        if (tag.guid !== selectedLarpTag) {
          newTagFilter.push(tag);
        }
      });

      let newlisttags = [];
      tagState.listTags.forEach(tag => {
        if (tag !== selectedLarpTag) {
          newlisttags.push(tag);
        }
      })

      await setTagState({
        ...tagState,
        listTags:newlisttags
      })
      await setTagSelectValues(newTagFilter);
      await setSelectedLarpTag(null);
    }
    else {
      let newTagFilter = [];

      tagSelectValues.forEach(tag => {
        if (tag.guid !== selectedLarpTag) {
          newTagFilter.push(tag);
        }
      });

      let newlisttags = [];
      tagState.listTags.forEach(tag => {
        if (tag !== selectedLarpTag) {
          newlisttags.push(tag);
        }
      })

      await setTagState({
        ...tagState,
        listTags:newlisttags
      })
      await setTagSelectValues(newTagFilter);
      await setSelectedLarpTag(e.guid);
    }
  }

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPage(newPage);
  }

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }

  const clearfilters = async () => {
    setBtnDisabledState(true);

    setTagState({
      ...tagState,
      listTags: []
    });

    setTagSelectValues([]);

    await setFilterState({
      ...filterState,
      ItemsFilter: '',
      SeriesFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
    });

    await setClearfilterState(true);
    await setClearfilterState(false);
  }

  const tagClicked = (e) => {
    const newtag = currentTagList.find((element) => element.guid === e )
    if (newtag !== undefined ) {
    const listguids = tagState.listTags;
    if (listguids.findIndex(element => element === e) === -1 ) {
      listguids.push(e);
    }

    setTagState({
      ...tagState,
      listTags: listguids
    });

    if (tagSelectValues.length === 0 || tagSelectValues.findIndex((element) => element.guid === e) === -1) {
    const setNewTagslist = tagSelectValues;
    setNewTagslist.push(newtag);
    setTagSelectValues(setNewTagslist);
    }

    if (filterState.ItemsFilter !== '' || filterState.SeriesFilter !== '' 
      || filterState.EditorFilter !== '' || filterState.CreatorFilter !== '' || listguids.length > 0) {
      setBtnDisabledState(false);
    } else {
      setBtnDisabledState(true);
    }
  }
  }

  const updateFilter = async (e, updatedfeild) => {
    try {
      if (updatedfeild === 'Items') {
        await setFilterState({
          ...filterState,
          ItemsFilter: e
        })

        if (e !== '' || filterState.SeriesFilter !== '' || tagState.listguids.length > 0) {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }
      if (updatedfeild === 'Series') {
        await setFilterState({
          ...filterState,
          SeriesFilter: e
        })

        if (e !== '' || filterState.ItemsFilter !== '' || tagState.listguids.length > 0) {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }
      if (updatedfeild === 'Editor') {
        await setFilterState({
          ...filterState,
          EditorFilter: e
        })

        if (e !== '' || filterState.EditorFilter !== '' || tagState.listguids.length > 0) {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }
      if (updatedfeild === 'Creator') {
        await setFilterState({
          ...filterState,
          CreatorFilter: e
        })

        if (e !== '' || filterState.CreatorFilter !== '' || tagState.listguids.length > 0) {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const updateTags = (e) => {
    const listguids = [];

    e.forEach(element => {
      if (!listguids.find(e => e === element.guid)) {
        listguids.push(element.guid)
      }
    })

    setTagSelectValues(e);

    setTagState({
      ...tagState,
      listTags: listguids
    })

    if (filterState.ItemsFilter !== '' || filterState.SeriesFilter !== '' || listguids.length > 0) {
      setBtnDisabledState(false);
    } else {
      setBtnDisabledState(true);
    }
  }

  const handleKickOpen = (e) => {
    setKickDialogOpen({
      ...kickDialogOpen,
      open: true,
      row: e
    })
  }

  const Delete = async (e) => {
    setFullDeleteDialogOpen({
      row: e,
      open: true
    })
  }

  const handleKickClose =() => {
    setKickDialogOpen({
      ...kickDialogOpen,
      open: false,
      row: null
    })    
  }

return (
  !displayState.display ? 
  <></>:
<div className='itemTable-display'>
  <TableContainer className='nexus-table'>
    <Table>
    <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
    <TableRow>
    <TableCell colSpan={2} className='table-topper'>
      
    <div className='table-topper-buttons'>
    { !props.isSelector?
    <>
  <button className='button-action' onClick={(e) => props.NewItemLink(e)}>Add New Item</button>
  <button className='button-action' onClick={(e) => props.NavToSelectItems(e)}>Select/Print Items</button> 
  </> :
  <>
  { !props.isCharSheet ?
  <> 
   <button className="button-action" onClick={() => props.GoToPrint(true)}> View and Print </button>
   <button className="button-cancel" onClick={() => props.GoBack(false)}> Go Back </button>

   </>
   :
   <button className="button-action" onClick={() => props.GoBack(false)}> Save and Return </button>
  }
  </>

    }           
    </div> 
     
    </TableCell>
    <TableCell className='table-topper'>
      {props.authLevel > 1 ?
      <FormControlLabel
      control={
        <Switch onChange={() => props.ToggleSwitch()}
        checked={props.selectedItemsApproved}/>
      }
      label={props.selectedItemsApproved ? 'Approved Items' : 'Unapproved Items'}
      /> :
      <></>}
      </TableCell>
      <TableCell className='table-topper'>
      {props.commentFilterOn !== undefined && !props.isSelector ?
      <FormControlLabel
      control={
        <Switch onChange={() => props.ToggleCommentSwitch()}
        checked={!props.commentFilterOn}/>}
      label={props.commentFilterOn ? 'Only Commented Items' : 'All Items'}
      /> :
      <></>}
      </TableCell>
      <TableCell className='table-topper'>
      {props.authLevel > 2 && !props.selectedItemsApproved && !props.isSelector ?
      <FormControlLabel
      control={
        <Switch onChange={() => props.ToggleApprovReadySwitch()}
        checked={!props.readyApproved}/>
      }
      label={props.readyApproved ? 'Ready for Approval' : 'All Items'}
      /> :
      <></>}
      </TableCell>
      <TableCell className='table-topper'>
      {props.authLevel > 2 && !props.selectedItemsApproved && !props.isSelector ?
      <FormControlLabel
      control={
        <Switch onChange={() => props.ToggleApprovableSwitch()}
        checked={!props.showApprovableOnly}/>
      }
      label={props.showApprovableOnly ? 'Approvable Items' : 'All Items'}
      /> :
      <></>}
      </TableCell>
      <TableCell colSpan={3} className='table-topper'/>
      </TableRow>
        <TableRow>
        <TableCell colSpan={props.authLevel > 2 && !props.selectedItemsApproved ? 3 : 3} className='table-topper'>
          {props.authLevel > 2 && !props.selectedItemsApproved && !props.isSelector ? (
            <div className='input-pair'>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Sheet Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Sheet Status"
                    onChange={e => UpdateApprovalFilter(e)}  
                    >
                    <MenuItem value={''}>All Approval States</MenuItem>
                    <MenuItem value={'U'}>Unapproved</MenuItem>
                    <MenuItem value={'1'}>First Approval Done</MenuItem>
                  </Select>
                  </FormControl> 
                  </div> )
                 : (<div></div>)} </TableCell>
                <TableCell colSpan={1} className='table-topper'>
                  <div className='input-pair'>
                    <FormLabel>Include Items from Specific LARP</FormLabel>
                    <Autocomplete 
                      id="include-items-from-specific-larp"
                      value={autocompSelectedValue}
                      key={resetInputField}
                      options={props.larpTags}
                      getOptionLabel={(option) => option.name}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            value:larpAutoCompValue
                          }}
                          placeholder="select larp"
                          variant="outlined"
                          onChange={(e) => UpdateLarpAutoComp(e.target.value)}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: <IconButton 
                              sx={{visibility: larpAutoCompValue !== '' && larpAutoCompValue !== null ? "visible": "hidden"}} 
                              onClick={() => UpdateLarpAutoComp('')}><Clear /></IconButton>}} 
                        />
                        )}
                        getoptionselected={(opt, val) => opt === val}
                        onChange={(event, val) => selectLarpTag(val)}
                    />
                  </div>
          </TableCell>
          <TableCell className='table-topper'>  
          <div className='table-topper-buttons'>     
            <button className='button-cancel' disabled={btnDisabledState} onClick={clearfilters}>Clear Filters</button>
            </div>
          </TableCell>
          <TableCell colSpan={4} className='table-topper'>
                  <TablePagination
                    component="div"
                    count={displayState.totalrows}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableCell>
               
          </TableRow>
          <TableRow>
            { !props.isSelector ?
          <TableCell className="short-column table-cell-center">Status</TableCell> :
          <></> 
            }
                { props.isSelector ?
                <TableCell></TableCell> :
                props.selectedItemsApproved ? <></> :
                   <TableCell className='short-column table-cell-center'>Ready For Approval
                   </TableCell>
                    }
            { props.isSelector ?
                <TableCell></TableCell> :
          props.commentFilterOn !== undefined ?  <TableCell>Item Comments</TableCell> : <></>
          }     
          <TableCell> Name </TableCell>
          <TableCell> Series </TableCell>
          <TableCell> Tags </TableCell>
          <TableCell> View </TableCell>
          { props.authLevel >= 1 && !props.isSelector? 
                <>
                <TableCell >Edit</TableCell> 
                </> :<TableCell ></TableCell> 
          } 
          {props.selectedItemsApproved  && props.authLevel >= 5 && !props.isSelector ? 
                <>
                <TableCell >Kick</TableCell> 
                </> :<></>
                 }
          { props.authLevel >= 6 && !props.isSelector && !props.selectedItemsApproved ?
                <>
                <TableCell >Delete</TableCell> 
                </> :<TableCell ></TableCell> 
                 } 
        </TableRow>
        <TableRow className='table-filter-row'>
        { !props.isSelector ?
              <TableCell>   <FilterIcon label="Editor" clearfilter={clearfilterState} filterup={e => updateFilter(e, 'Editor')}/>
              <FilterIcon label="Created By" clearfilter={clearfilterState} filterup={e => updateFilter(e, 'Creator')}/>          
              </TableCell> :
          <></> 
            }
                {props.selectedItemsApproved  ?
                  props.isSelector ? <TableCell></TableCell> : <></> :
                   <TableCell >
                   </TableCell>
                  }
                {props.commentFilterOn !== undefined ?  <TableCell></TableCell> : <></>}
                <TableCell>
                  <div className='filter-container'>
                    <FilterIcon label="Name" clearfilter={clearfilterState} filterup={e => updateFilter(e, 'Items')}/>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='filter-container'>
                    <FilterIcon label="Series" clearfilter={clearfilterState} filterup={e => updateFilter(e, 'Series')}/>
                  </div>
                </TableCell>
                <TableCell colSpan={props.selectedItemsApproved  && props.authLevel > 5 ? 3 : 2  }>
                  <div className='input-pair'>
                    <Autocomplete
                      multiple
                      key={clearfilterState}
                      value={tagSelectValues}
                      id="multiple-limit-tags"
                      options={currentTagList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, val) => updateTags(val)}
                      renderInput={(params) => (
                        <TextField placeholder='filter tags' {...params} />
                      )}
                    />
                  </div>
                </TableCell>
                {props.authLevel > 1? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 }
                {!props.selectedItemsApproved  || props.authLevel <= 5? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 }
                {props.selectedItemsApproved  && props.authLevel >= 5 && !props.isSelector? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 }
              </TableRow>
        </TableHead>
        <TableBody>
{displayState.apimessage?.map(item => {
  return (
    <TableRow key={Math.random()}>
                    { props.isSelector ? <></> :
                        <TableCell className='item-default-cursor table-cell-center'>
                    {
                      item.createdbyuserGuid !== null && item.firstapprovalbyuserGuid !== null && item.secondapprovalbyuserGuid !== null
                        ? <div className='' title="approved">
                          <HoverText  plainText={'A'} hoverText={"Edit By: " + item.editbyUser + "\n1st App. By: " + item.firstapprovalby + "\n2nd App. By: " + item.secondapprovalby}/>
                          </div>
                        : null
                    }
                    {
                      item.createdbyuserGuid !== null && item.firstapprovalbyuserGuid == null && item.secondapprovalbyuserGuid == null
                        ? <div className='' title="unapproved: needs 2 approvals">
                           <HoverText  plainText={'U'} hoverText={"Edit By: " + item.editbyUser}/>
                        </div>
                        : null
                    }
                    {
                      item.createdbyuserGuid !== null && item.firstapprovalbyuserGuid !== null && item.secondapprovalbyuserGuid == null
                      ? <div className='' title="has 1st approval, needs 2nd approval">
                        <HoverText  plainText={'1st'} hoverText={"Edit By: " + item.editbyUser + "\n1st App. By: " + item.firstapprovalby}/>
                        </div>
                      : null
                    }
                  </TableCell>
                   }
                   { props.isSelector ? <TableCell></TableCell> :
                    props.selectedItemsApproved ? <></> :
                   <TableCell className='table-default-cursor table-cell-center'>
                    { item.readyforapproval !== null && item.readyforapproval === true ? "Yes" : "No"}
                   </TableCell>
                    }
      { props.isSelector ? <TableCell></TableCell> :
        props.commentFilterOn !== undefined ?  
      <TableCell>
       {item.hasreview ? 'Yes' : 'No'}
      </TableCell> : <></>}
    <TableCell key={Math.random()}>
        {item.name}
    </TableCell>
    <TableCell>
      {item.series !== null 
      ? item.series
      : ''}
    </TableCell>
    <TableCell key={Math.random()}>
    <Tags tags={item.tags} clickable={true} tagClick={(e) => tagClicked(e)}/>
    </TableCell>
    <TableCell key={Math.random()}>
    <IconButton  onClick={() => props.DirectToItem(props.selectedItemsApproved ? 'ItemSheetApproveds' 
     : 'ItemSheets', item.guid)}>
  <ArrowCircleRightSharpIcon  className="table-icon-button" />
  </IconButton>
  </TableCell>
  {props.authLevel >= 2 && !props.isSelector? 
                <>
                <TableCell >
                {props.authLevel > 1
             ? <div>
              <IconButton  onClick = {() => props.Edit(props.selectedItemsApproved ? 'ItemSheetApproveds' 
     : 'ItemSheets', item.guid)}>
              <EditSharpIcon className="table-icon-button" />
                  </IconButton>
              </div>
              : <div></div>}
              </TableCell> 
                </> :<TableCell ></TableCell> 
                 } 
           {props.selectedItemsApproved  && props.authLevel >= 5 && !props.isSelector? 
                <>
                <TableCell > 
                  <IconButton onClick = {() => handleKickOpen(item)}>
                  <FastRewindSharpIcon className="table-icon-button" />
                   </IconButton>
                    </TableCell> 

                </> 
                :<></>
                 }
  {props.authLevel >= 5 && !props.isSelector? 
                <>
                <TableCell >
                {props.authLevel > 5 && !props.selectedItemsApproved 
             ? <div>
              <IconButton aria-label='delete' onClick = {() => Delete(item)}>
              <DeleteSharpIcon className="table-icon-button" />
              </IconButton>
              </div>
              : <div></div>}
              </TableCell> 
                </> :<TableCell ></TableCell> 
                 } 
  </TableRow>
  )
})}
</TableBody>
</Table>
</TableContainer>  

{
          kickDialogOpen.row !== null
          ? <KickDialog  
          row={kickDialogOpen.row}
          handleKickClose={() => handleKickClose()}
          path ={{
              pathname: 'ItemSheetApproveds',
              mutationName: 'itemKick',
              refreshName: ['listUnapprovedItems', 'listApprovedItems']
              }} /> 
          : <></>
           }

          { fullDeleteDialogOpen.open ?
       <DeleteSanityDialog 
            guid={fullDeleteDialogOpen.row.guid}
            name={fullDeleteDialogOpen.row.name}
            path={'ItemSheets/LinkedCharacters/'}
            apiPath={ 
              {path:'ItemSheets', refreshName:'listUnapprovedItems', mutationName:'itemDelete' }}
            sanityMutation={'listSanityItems'}
            isOpen={fullDeleteDialogOpen.open}
            GoBack={() => setFullDeleteDialogOpen({
                  row: null,
                  open: false
                })}
                />
                : <></>
              }


</div>
) 
}

export default ItemTable

ItemTable.propTypes = {
selectedItemsApproved: PropTypes.bool,
commentFilterOn: PropTypes.bool,
showApprovableOnly: PropTypes.bool,
readyApproved: PropTypes.bool,
undata: PropTypes.object,
DirectToItem: PropTypes.func,
appdata: PropTypes.object,
authLevel: PropTypes.number,
larpTags: PropTypes.array,
tagslist: PropTypes.array,
userGuid: PropTypes.string,
showallLARPLinked: PropTypes.bool,
NewItemLink: PropTypes.func,
NavToSelectItems: PropTypes.func,
ToggleSwitch: PropTypes.func,
ToggleCommentSwitch: PropTypes.func,
ToggleApprovableSwitch: PropTypes.func,
ToggleApprovReadySwitch: PropTypes.func,
DeleteSeries: PropTypes.func,
KickItem: PropTypes.func,
Edit: PropTypes.func,
isSelector: PropTypes.bool,
isCharSheet: PropTypes.bool,
GoBack: PropTypes.func,
GoToPrint: PropTypes.func
}