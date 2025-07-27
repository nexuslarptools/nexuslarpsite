//import React from 'react'
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import { Autocomplete, FormControl, FormControlLabel, FormLabel, IconButton, InputLabel, 
  MenuItem, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, 
  TablePagination, TableRow, TextField, 
  Tooltip} from '@mui/material';
import PropTypes from 'prop-types';
import './table.scss';
import { Clear } from '@mui/icons-material';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import EditSharpIcon from '@mui/icons-material/EditSharp'
import FastRewindSharpIcon from '@mui/icons-material/FastRewindSharp';
import { useState, useEffect } from 'react';
import Tags from '../tags/tags';
import KickDialog from '../dialogs/kickdialogbox';
import DeleteSanityDialog from '../dialogs/deletesanitydialog';
import HoverText from '../hovertext/hovertext';
import FilterAltSharpIcon from '@mui/icons-material/FilterAltSharp';
import './_itemtable.scss'
import TextBox from '../inputs/textbox';


const ItemTable = props => {


  const [displayState, setDisplayState] = useState({
    apimessage: '',
    display: false
  });
  const [tagState, setTagState] = useState({
    listTags: []
  });
      const [dialogStates, setDialogState] = useState({
        Series: false,
        Item: false,
        Creator: false,
        Editor: false
      });
  const [clearfilterState] = useState(false);
  const [selectedLarpTag, setSelectedLarpTag] = useState(props.Filters.SelectedLarpTag);
  const [tagSelectValues, setTagSelectValues] = useState(props.Filters.TagSelectValues);
  const [selectedApprovalState] = useState(props.Filters.SelectedApproval);
  const [autocompSelectedValue, setAutocompSelectedValue] = useState(null);
  const [resetInputField, setResetInputField] = useState(false);
  const [larpAutoCompValue, setLarpAutoCompValue] = useState(props.Filters.LarpAutoCompValue);
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

    if (!props.isSearch && selectedLarpTag !== null && selectedLarpTag !== '') {
      const fullSelectLARPTag = props.larpTags.find((tag) => tag.guid === selectedLarpTag);
      tagDrowdownList.push(fullSelectLARPTag);
    }
    if (props.isSearch) {
      props.larpTags.forEach(tag => {
        tagDrowdownList.push(tag);
      })
    }

    setCurrentTagList(tagDrowdownList);

    let filteredRows = props.appdata?.iteList;
    filteredRows = filteredRows.filter(item => removeDiacritics(item.name.toLocaleLowerCase()).includes(removeDiacritics(props.Filters.ItemsFilter.toLocaleLowerCase())));
    filteredRows = filteredRows.filter(item => (item.series === null && props.Filters.SeriesFilter === '') || 
       (item.series !== null && removeDiacritics(item.series.toLocaleLowerCase()).includes(removeDiacritics(props.Filters.SeriesFilter.toLocaleLowerCase()))));
    filteredRows = filteredRows.filter(item => removeDiacritics(item.createdby.toLocaleLowerCase()).includes(removeDiacritics(props.Filters.CreatorFilter.toLocaleLowerCase())));
    filteredRows = filteredRows.filter(item => removeDiacritics(item.editbyUser.toLocaleLowerCase()).includes(removeDiacritics(props.Filters.EditorFilter.toLocaleLowerCase())));
   
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

    if (tagSelectValues.length > 0 || props.larpTags.length > 0) {
      const newfilter = [];
      filteredRows.forEach((row) => {
        if (row.tags !== null) {
            const listguids = []
            row.tags.forEach((tag) => {
              listguids.push(tag.guid);
            })
            if (listguids.length === 0 || props.larpTags.every(elem => !listguids.includes(elem.guid)) ||
                  listguids.includes(selectedLarpTag)) {
              if (tagSelectValues.every(elem => listguids.includes(elem.guid))) {
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

    for (const key of Object.keys(props.Filters)) {
      if ((key === 'TagSelectValues' && props.Filters[key].length > 0) || 
          (key !== 'TagSelectValues'  && props.Filters[key] !== '')) {
         setBtnDisabledState(false)
      }
    }

    setDisplayState({
      ...displayState,
      apimessage: filteredPageRows,
      totalrows: filteredrowstotal,
      display: true
    })
  }, [props.appdata, props.showallLARPLinked, props.showApprovableOnly, props.readyApproved,  props.commentFilterOn,
    props.Filters, tagState, selectedLarpTag, selectedApprovalState, page, rowsPerPage]);


    const UpdateApprovalFilter = async (e) => {
      let setfilter = props.Filters;
      setfilter.SelectedApproval = e.target.value;
      props.UpdateFilter(setfilter);
    }

    const UpdateLarpAutoComp =(e) => {
      let setFilters = props.Filters;
      setFilters.LarpAutoCompValue = e;
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
    let setFilters = props.Filters;

    if (e === undefined || e === null) {
      setLarpAutoCompValue('');
      setFilters.LarpAutoCompValue = '';
      setFilters.SelectedLarpTag = '';
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
      setAutocompSelectedValue(e.name);
      setLarpAutoCompValue(e.name);
      setFilters.LarpAutoCompValue = e.name;
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
      setFilters.SelectedLarpTag = e.guid;
    }
    props.UpdateFilter(setFilters);
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


  const tagClicked = (e) => {
    let setfilter = props.Filters;

    const listguids = tagState.listTags;

    if (listguids.findIndex(element => element === e) === -1 
    && currentTagList.findIndex(el => el.guid === e) !== -1) {
      listguids.push(e);
    }

    setTagState({
      ...tagState,
      listTags: listguids
    });

    const newtag = currentTagList.find((element) => element.guid === e )
    if (newtag !== undefined 
      && (tagSelectValues.length === 0 || tagSelectValues.findIndex((element) => element.guid === e) === -1)) {
      const setNewTagslist = tagSelectValues;
      setNewTagslist.push(newtag);
      setTagSelectValues(setNewTagslist);
      setfilter.TagSelectValues = setNewTagslist;
      props.UpdateFilter(setfilter);
    }
  }

  const clearfilters = async () => {
    let setfilter = {
      SeriesFilter: '',
      ItemsFilter: '',
      CreatorFilter: '',
      EditorFilter: '',
      SelectedApproval : '',
      LarpAutoCompValue: '',
      SelectedLarpTag: '',
      TagSelectValues: []
    };

    props.UpdateFilter(setfilter);
  }


  const updateFilter = async (e, updatedfeild) => {
    
    await FilterClose(updatedfeild);


    if (e === undefined)
    {
      let togglestate = dialogStates[updatedfeild];
      await setDialogState({
        ...dialogStates,
        [updatedfeild]: !togglestate
      });
      return;
    }
    let setfilter = props.Filters;
    let value = e;
    try {
      if (updatedfeild === 'Item') {
        setfilter.ItemsFilter = value;
      }
      if (updatedfeild === 'Series') {
        setfilter.SeriesFilter = value;
      }
      if (updatedfeild === 'Editor') {
        setfilter.EditorFilter = value;
      }
      if (updatedfeild === 'Creator') {
        setfilter.CreatorFilter = value;
      }
        props.UpdateFilter(setfilter);
    } catch (error) {
      console.log(error);
    }
  }

  const updateTags = (e) => {
    let setfilter = props.Filters;
    const listguids = []
    e.forEach(element => {
      listguids.push(element.guid)
    });
    setTagState({
      ...tagState,
      listTags: listguids
    });

    setTagSelectValues(e);

    setfilter.TagSelectValues = e;
    props.UpdateFilter(setfilter);

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

  const FilterOpen = async(e) => {
    let togglestate = dialogStates[e];
    await setDialogState({
      ...dialogStates,
      [e]: !togglestate
    });
  }

    const FilterClose = async(e) => {
    if (dialogStates[e] !== false )
      {
      await setDialogState({
        ...dialogStates,
        [e]: false
      });
     }
  }

  const handleKickClose =() => {
    setKickDialogOpen({
      ...kickDialogOpen,
      open: false,
      row: null
    })    
  }

  const SelectApproveToggle = async() => {
    let switchinfo = 
    {
      selectedApproved: !props.selectedItemsApproved
    }
    if (!props.selectedItemsApproved)
    {
      if (props.showApprovableOnly)
      {
        switchinfo.showApprovableOnly = false;
      }
      if (props.readyApproved)
        {
          switchinfo.readyApproved = false;
        }
    }
    props.ToggleSwitches(switchinfo)
  }
return (
  !displayState.display ? 
  <></>:
  <div className='itemTable-display' >
  <TableContainer className='nexus-table'>
    <Table  sx={ {'& thead th:nth-child(9)': { width: '1%' },
        '& thead th:nth-child(10)': { width: '1%' }}
      } >
    <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
    <TableRow>
    <TableCell  colSpan={props.selectedItemsApproved ? 8 : 9}  className='table-topper'>
    <div className='table-controls' >
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
     
      {props.authLevel > 1 ?
      <FormControlLabel
      control={
        <Switch onChange={() => SelectApproveToggle() }
        checked={props.selectedItemsApproved}/>
      }
      label={props.selectedItemsApproved ? 'Approved Items' : 'Unapproved Items'}
      /> :
      <></>}
      {
      props.authLevel > 1 ? 
      props.commentFilterOn !== undefined && !props.isSelector ?
      <FormControlLabel
      control={
        <Switch onChange={() => 
          props.ToggleSwitches({commentFilter: !props.commentFilterOn})}
        checked={!props.commentFilterOn}/>}
      label={props.commentFilterOn ? 'Only Commented Items' : 'All Items'}
      /> :
      <></> : <></>
    }
      {props.authLevel > 2 && !props.selectedItemsApproved && !props.isSelector ?
      <FormControlLabel
      control={
        <Switch onChange={() => 
          props.ToggleSwitches({readyApproved: !props.readyApproved})}
        checked={!props.readyApproved}/>
      }
      label={props.readyApproved ? 'Ready for Approval' : 'All Items'}
      /> :
      <></>}
      {props.authLevel > 2 && !props.selectedItemsApproved && !props.isSelector ?
      <FormControlLabel
      control={
        <Switch onChange={() => 
          props.ToggleSwitches({showApprovableOnly: !props.showApprovableOnly})}
        checked={!props.showApprovableOnly}/>
      }
      label={props.showApprovableOnly ? 'Approvable Items' : 'All Items'}
      /> :
      <></>}
      </div>
      </TableCell>

      </TableRow>
      
        <TableRow>
        <TableCell colSpan={props.selectedItemsApproved ? 8 : 9} className='table-topper'>
          <div className='table-controls-pagination'>
          <div className='selectors'>     
          {props.authLevel > 2 && !props.selectedItemsApproved && !props.isSelector ? (
            <div className='selector'>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Select Sheet Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Sheet Status"
                    value={props.Filters.SelectedApproval}
                    onChange={e => UpdateApprovalFilter(e)}  
                    >
                    <MenuItem value={''}>All Approval States</MenuItem>
                    <MenuItem value={'U'}>Unapproved</MenuItem>
                    <MenuItem value={'1'}>First Approval Done</MenuItem>
                  </Select>
                  </FormControl> 
                  </div> )
                 : (<></>)}

                { props.larpTags.length > 0  && !props.isSearch ?
                 <div className='selector'>
                  <div className='input-pair'>
                  <FormLabel sx={{fontSize: 12}}>Include Items linked to Specific LARP</FormLabel>
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
                          placeholder="Select LARP"
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
                  </div> :
                  <></>
}
       
            <button className='button-cancel' disabled={btnDisabledState} onClick={clearfilters}>Clear Filters</button>
            </div>
            <div className='table-topper-pagination'>   
                  <TablePagination
                    component="div"
                    count={displayState.totalrows}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                  </div>
                  </div>
                </TableCell>
          </TableRow>

          <TableRow className='table-filter-row'>
            <TableCell colSpan={props.selectedItemsApproved ? 8 : 9}>
          <div className='fullspan-cell'>
          <div className='search-row'>
            {!props.isSelector ?
           <div className='search-container'>
            <div className='filter-container'>
                                    <Tooltip title="Filter by Last Editor">
                                <button className='button-action-square' onClick={() => FilterOpen('Editor')}>
                                <FilterAltSharpIcon sx={{fontSize: 23}} />
                                 </button>
                                   </Tooltip>
                                 <TextBox title={'Sheet Editor Name'} onClose={(e) => updateFilter(e, 'Editor')} value={props.Filters.EditorFilter !== undefined 
                                      && props.Filters.EditorFilter !== null ?
                                      props.Filters.EditorFilter : ''} open={dialogStates.Editor}/>
                                      {props.Filters.EditorFilter !== undefined 
                                      && props.Filters.EditorFilter !== null && props.Filters.EditorFilter !== '' ?
                                      props.Filters.EditorFilter : <div className='inactive-text'>Last Edited By</div>}
                                </div>
                                <hr/> 
                                </div>      
               :
          <></> 
            }
                {props.selectedItemsApproved  ?
                  props.isSelector ? <></> : <></> :
                            <div className='search-container'>
                         
                               <div className='filter-container'>
                                  <Tooltip title="Filter by Sheet Creator">
                                <button className='button-action-square' onClick={() => FilterOpen('Creator')}>
                                <FilterAltSharpIcon sx={{fontSize: 23}} />
                                 </button>
                                 </Tooltip>
                                 <TextBox title={'Sheet Creator Name'} onClose={(e) => updateFilter(e, 'Creator')} value={props.Filters.CreatorFilter !== undefined 
                                      && props.Filters.CreatorFilter !== null ?
                                      props.Filters.CreatorFilter : ''} open={dialogStates.Creator}/>
                                      {props.Filters.CreatorFilter !== undefined 
                                      && props.Filters.CreatorFilter !== null && props.Filters.CreatorFilter !== '' ?
                                      props.Filters.CreatorFilter : <div className='inactive-text'>Created By</div>}
                                      
                                </div>
                                <hr/> 
                                </div>
                  }
                {props.commentFilterOn !== undefined ?
                  !props.selectedItemsApproved  ?
                <></> :
                   <div className='search-container'>
                <div className='filter-container'>
                                  <Tooltip title="Filter by Sheet Creator">
                                <button className='button-action-square' onClick={() => FilterOpen('Creator')}>
                                <FilterAltSharpIcon sx={{fontSize: 23}} />
                                 </button>
                                 </Tooltip>
                                 <TextBox title={'Sheet Creator Name'} onClose={(e) => updateFilter(e, 'Creator')} value={props.Filters.CreatorFilter !== undefined 
                                      && props.Filters.CreatorFilter !== null ?
                                      props.Filters.CreatorFilter : ''} open={dialogStates.Creator}/>
                                      {props.Filters.CreatorFilter !== undefined 
                                      && props.Filters.CreatorFilter !== null && props.Filters.CreatorFilter !== '' ?
                                      props.Filters.CreatorFilter : <div className='inactive-text'>Created By</div>}
                                      
                                </div>
                                <hr/> 

                                </div> : <></>}
              <div className='search-container'>
                <div className='filter-container'>
                <Tooltip title="Filter by Item Name">
                  <button className='button-action-square' onClick={() => FilterOpen('Item')}>
                  <FilterAltSharpIcon sx={{fontSize: 23}} />
                   </button>
                   </Tooltip>
                   <TextBox title={'Item Name'} onClose={(e) => updateFilter(e, 'Item')} value={props.Filters.ItemsFilter !== undefined 
                        && props.Filters.ItemsFilter !== null ?
                        props.Filters.ItemsFilter : ''} open={dialogStates.Item}/>
                        {props.Filters.ItemsFilter !== undefined 
                        && props.Filters.ItemsFilter !== null  && props.Filters.ItemsFilter !== '' ?
                        props.Filters.ItemsFilter : <div className='inactive-text'>Item Name</div>}
                  </div>
                  <hr/>
                  </div>
                <div className='search-container'>
                <div className='filter-container'>                   
                    <Tooltip title="Filter by Series">
                  <button className='button-action-square' onClick={() => FilterOpen('Series')}>
                  <FilterAltSharpIcon sx={{fontSize: 23}} />
                   </button>
                   </Tooltip>
                   <TextBox title={'Series'} onClose={(e) => updateFilter(e, 'Series')} value={props.Filters.SeriesFilter !== undefined 
                        && props.Filters.SeriesFilter !== null ?
                        props.Filters.SeriesFilter : ''} open={dialogStates.Series}/>
                        {props.Filters.SeriesFilter !== undefined 
                        && props.Filters.SeriesFilter !== null  && props.Filters.SeriesFilter !== '' ?
                        props.Filters.SeriesFilter : <div className='inactive-text'>Series</div>}
                  </div>
                  <hr/>
                  </div>
                  </div>
                <div className='tags-container'>
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
                  </div>
                {props.authLevel > 1? 
                <>
                </> :<></>
                 }
                {!props.selectedItemsApproved  || props.authLevel <= 5? 
                <>
                </> :<></>
                 }
{/*                 {props.selectedItemsApproved  && props.authLevel >= 5 && !props.isSelector? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 } */}
                 </div>
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
          props.commentFilterOn !== undefined ?  <TableCell className='short-column table-cell-center'>Item Comments</TableCell> : <></>
          }     
          <TableCell className='short-column'> Item </TableCell>
          <TableCell className='short-column'> Series </TableCell>
          <TableCell className='short-column table-cell-center'> Tags </TableCell>
          <TableCell key={Math.random()}  className='icon-column table-cell-center'> View </TableCell>
          { props.authLevel > 1 && !props.isSelector? 
                <>
                 <TableCell key={Math.random()} className='icon-column table-cell-center'>Edit</TableCell> 
                </> :<TableCell ></TableCell> 
          } 
          {props.selectedItemsApproved  && props.authLevel >= 5 && !props.isSelector ? 
                <>
                 <TableCell key={Math.random()} className='icon-column table-cell-center'>Kick</TableCell> 
                </> :<></>
                 }
          { props.authLevel >= 6 && !props.isSelector && !props.selectedItemsApproved ?
                <>
                 <TableCell key={Math.random()} className='icon-column table-cell-center'>Delete</TableCell> 
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
      <TableCell className='table-default-cursor table-cell-center'>
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
    <TableCell key={Math.random()} className='tags-column'>
    <Tags tags={item.tags} clickable={true} tagClick={(e) => tagClicked(e)}/>
    </TableCell>
    <TableCell className='icon-column table-cell-center'>
    <IconButton  onClick={() => props.DirectToItem(props.selectedItemsApproved ? 'ItemSheetApproveds' 
     : 'ItemSheets', item.guid)}>
  <ArrowCircleRightSharpIcon  className="table-icon-button" />
  </IconButton>
  </TableCell>
  {props.authLevel >= 2 && !props.isSelector? 
                <>
                   <TableCell className='icon-column table-cell-center'>
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
                   <TableCell className='icon-column table-cell-center' >
                  <IconButton onClick = {() => handleKickOpen(item)}>
                  <FastRewindSharpIcon className="table-icon-button" />
                   </IconButton>
                    </TableCell> 

                </> 
                :<></>
                 }
             {props.authLevel >= 5 && !props.isSelector? 
                <>
                {props.authLevel > 5 && !props.selectedItemsApproved 
                ? <TableCell className='icon-column table-cell-center'>
              <IconButton aria-label='delete' onClick = {() => Delete(item)}>
              <DeleteSharpIcon className="table-icon-button" />
              </IconButton>
              </TableCell> 
              : <></>}
                </> : <></>
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
GoToPrint: PropTypes.func,
Filters: PropTypes.object,
UpdateFilter: PropTypes.func,
ToggleSwitches: PropTypes.func,
isSearch: PropTypes.bool
}