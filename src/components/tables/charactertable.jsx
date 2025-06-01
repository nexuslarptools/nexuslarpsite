import { useState, useEffect } from 'react';
import {
  TableContainer, Table, TableHead, TableBody, TableRow, TableCell,
  Autocomplete, TextField, TablePagination, IconButton,
  FormControlLabel,
  Switch,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  FormLabel,
  Tooltip
} from '@mui/material';
import PropTypes from 'prop-types';
import Tags from '../tags/tags';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import FastRewindSharpIcon from '@mui/icons-material/FastRewindSharp';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import Loading from '../../components/loading/loading';
import { Clear } from '@mui/icons-material';
import KickDialog from '../dialogs/kickdialogbox';
import DeleteDialogFull from '../dialogs/deletedialogcomplete';
import HoverText from '../hovertext/hovertext';
import SearchSharpIcon from '@mui/icons-material/SearchSharp';
import TextBox from '../inputs/textbox';

const CharacterTable = props => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filterState, setFilterState] = useState(props.Filters);
    const [dialogStates, setDialogState] = useState({
      Series: false,
      Character: false,
      Creator: false,
      Editor: false
    });
      const [tagState, setTagState] = useState({
        listTags: []
      });
    const [selectedLarpTag, setSelectedLarpTag] = useState(props.Filters.SelectedLarpTag !== undefined && 
      props.Filters.SelectedLarpTag !== null ?
       props.Filters.SelectedLarpTag : '');
    const [autocompSelectedValue, setAutocompSelectedValue] = useState(null);
    const [resetInputField, setResetInputField] = useState(false);
    const [larpAutoCompValue, setLarpAutoCompValue] = useState(props.Filters.LarpAutoCompValue);
    const [btnDisabledState, setBtnDisabledState] = useState(true);
    const [tagSelectValues, setTagSelectValues] = useState(props.Filters.TagSelectValues);
    const [currentTagList, setCurrentTagList] = useState([]);
    const [clearfilterState, setClearfilterState] = useState(null);
    const [displayState, setDisplayState] = useState({
        apimessage: [],
        display: false
      });
      const [deleteDialogOpen, setDeleteDialogOpen] = useState({
        open: false,
        data: null
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
          if (tag.tagtypeguid === '26cd7510-9401-11ea-899a-4fd87913c65d') {
            tagDrowdownList.push(tag);
          }
        });
    
        if (selectedLarpTag !== null && selectedLarpTag !== '') {
          const fullSelectLARPTag = props.larpTags.find((tag) => tag.guid === selectedLarpTag);
          tagDrowdownList.push(fullSelectLARPTag);
        }
        setCurrentTagList(tagDrowdownList);

        let filteredRows = props.appdata;
        filteredRows = filteredRows.filter(item => (item.name === null && (props.Filters.CharacterFilter === undefined 
          || props.Filters.CharacterFilter === null || props.Filters.CharacterFilter === '')) 
         || (item.title !== null && removeDiacritics(item.name.toLocaleLowerCase()).includes(removeDiacritics(
           props.Filters.CharacterFilter !== undefined 
             && props.Filters.CharacterFilter !== null ?
             props.Filters.CharacterFilter.toLocaleLowerCase() : ''))));
        
        filteredRows = filteredRows.filter(item => (item.series === null && (props.Filters.SeriesFilter === undefined 
           || props.Filters.SeriesFilter === null || props.Filters.SeriesFilter === '')) 
          || (item.title !== null && removeDiacritics(item.title.toLocaleLowerCase()).includes(removeDiacritics(
            props.Filters.SeriesFilter !== undefined 
              && props.Filters.SeriesFilter !== null ?
              props.Filters.SeriesFilter.toLocaleLowerCase() : ''))));
          filteredRows = filteredRows.filter(item => removeDiacritics(item.createdByUser.toLocaleLowerCase()).includes(removeDiacritics(filterState.CreatorFilter.toLocaleLowerCase())));
          filteredRows = filteredRows.filter(item => removeDiacritics(item.editbyUser.toLocaleLowerCase()).includes(removeDiacritics(filterState.EditorFilter.toLocaleLowerCase())));
   
          

        if (props.showApprovableOnly) {
          filteredRows = filteredRows.filter(item => (item.editbyUserGuid !== props.userGuid && item.firstapprovalbyuserGuid !== props.userGuid));
        }
    
        if (props.Filters.SelectedApproval === 'U')
        {
          filteredRows = filteredRows.filter(character => (character.firstapprovalbyuserGuid === null ));
        }
    
        if (props.Filters.SelectedApproval === '1')
        {
          filteredRows = filteredRows.filter(character => (character.firstapprovalbyuserGuid !== null ));
        }

        if (props.readyApproved === true)
        {
          filteredRows = filteredRows.filter(character => (character.readyforapproval  === true ));
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
    
        setDisplayState({
          ...displayState,
          apimessage: filteredPageRows,
          totalrows: filteredrowstotal,
          display: true
        })

        for (const key of Object.keys(props.Filters)) {
          if ((key === 'TagSelectValues' && props.Filters[key].length > 0) || 
              (key !== 'TagSelectValues'  && props.Filters[key] !== '')) {
             setBtnDisabledState(false)
          }
        }

      }, [props.appdata, props.showallLARPLinked, props.showApprovableOnly,  props.readyApproved, props.commentFilterOn,
        props.Filters, page, rowsPerPage]);

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

      const selectLarpTag = async (e) => {
        let setFilters = filterState;

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

      const UpdateLarpAutoComp =(e) => {
        let setFilters = filterState;
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

      const updateFilter = async (e, updatedfeild) => {
        await FilterOpen(updatedfeild);
        let value = e;
        if (e === undefined || e === null)
        {
          if (e === undefined)
            {
              let togglestate = dialogStates[updatedfeild];
              await setDialogState({
                ...dialogStates,
                [updatedfeild]: !togglestate
              });
              return;
            }
        }
        try {
          let setfilter = filterState;
          if (updatedfeild === 'Name') {
            await setFilterState({
              ...filterState,
              CharacterFilter: value
            })
            setfilter.CharacterFilter = value;

          }
          if (updatedfeild === 'Series') {
            await setFilterState({
              ...filterState,
              SeriesFilter: value
            })
            setfilter.SeriesFilter = value;

          }
          if (updatedfeild === 'Editor') {
            await setFilterState({
              ...filterState,
              EditorFilter: value
            })
            setfilter.EditorFilter = value;

          }
          if (updatedfeild === 'Creator') {
            await setFilterState({
              ...filterState,
              CreatorFilter: value
            })
            setfilter.CreatorFilter = value;

          }
          props.UpdateFilter(setfilter);
        } catch (error) {
          console.log(error);
        }
      }

      const UpdateApprovalFilter = async (e) => {
        let setfilter = filterState;
        setfilter.SelectedApproval = e.target.value;
        props.UpdateFilter(setfilter);
      }

      const updateTags = (e) => {
        let setfilter = filterState;
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

      const tagClicked = (e) => {
        let setfilter = filterState;

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
        CharacterFilter: '',
        CreatorFilter: '',
        EditorFilter: '',
        SelectedApproval : '',
        LarpAutoCompValue: '',
        SelectedLarpTag: '',
        TagSelectValues: []
      };

      props.UpdateFilter(setfilter);
    }

    const handleKickOpen = (e) => {
      setKickDialogOpen({
        ...kickDialogOpen,
        open: true,
        row: e
      })
    }

    const handleDeleteClose = () => {
      setDeleteDialogOpen({
        ...deleteDialogOpen,
        open: false,
        data: null
      })
    }
  
    const handleKickClose =() => {
      setKickDialogOpen({
        ...kickDialogOpen,
        open: false,
        row: null
      })    
    }

    const Delete = async (e) => {
      setDeleteDialogOpen({
        data: e,
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

    const SelectApproveToggle = async() => {
      let switchinfo = 
      {
        selectedApproved: !props.selectedApproved
      }
      if (!props.selectedApproved)
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
  

    if (props === undefined || props.authLevel < 1 || !displayState.display || props.isLoading ) {
        return (<div className='loading-container'><Loading /></div>)
      } else {
        return (
          <>
            <TableContainer className='characterTable nexus-table'>
              <Table>
                <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                    <TableRow>
                    <TableCell  colSpan={props.selectedItemsApproved ? 8 : 9}  className='table-topper'>
                <div className='table-controls' >
                <div className='table-topper-buttons'>
                    <button className='button-action' onClick={(e) => props.NewCharacterLink(e)}>Add New Character</button>
                    </div> 
                     { props.authLevel > 1
                      ? <FormControlLabel control={ <Switch defaultChecked={props.selectedApproved} 
                            onChange={() => SelectApproveToggle() } /> }
                            label={props.selectedApproved ? 'Approved Characters' : 'Unapproved Characters'} />
                      : <div></div>
                    }
                  <FormControlLabel control={ <Switch defaultChecked={!props.commentFilterOn}  onChange={() => 
                            props.ToggleSwitches({commentFilter: !props.commentFilterOn})} /> }
                            label={props.commentFilterOn ? 'Only Commented Sheets' : 'All Sheets'}/> 
                    {props.authLevel > 2 && !props.selectedApproved? (
                      <FormControlLabel control={ <Switch defaultChecked={!props.showApprovableOnly} onChange={() => 
                        props.ToggleSwitches({showApprovableOnly: !props.showApprovableOnly})} /> }
                        label={props.showApprovableOnly ? 'Characters You Can Approve' : 'All Unapproved Characters'}  /> )
                    : (<div></div>)}
                     {props.authLevel > 2 && !props.selectedApproved ?
                      <FormControlLabel
                       control={<Switch onChange={() => 
                            props.ToggleSwitches({readyApproved: !props.readyApproved})} 
                            defaultChecked={!props.readyApproved}/>}
                            label={props.readyApproved ? 'Ready for Approval' : 'All Characters'}
                       /> : <></>}
                        <></>
                        </div>
                     </TableCell>
                    </TableRow>
                <TableRow>
                <TableCell colSpan={props.selectedItemsApproved ? 8 : 9} className='table-topper'>
                  <div className='table-controls-pagination'>
                   <div className='selectors'> 
                    {props.authLevel > 2 && !props.selectedApproved? (
                       <div className='selector'>
                       <div className='input-pair'>
                       <FormControl fullWidth>
                       <InputLabel id="demo-simple-select-label">Select Sheet Status
                       </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={props.Filters.SelectedApproval}
                        label="Sheet Status"
                        onChange={e => UpdateApprovalFilter(e)}>
                            <MenuItem value={''}>All Approval States</MenuItem>
                            <MenuItem value={'U'}>Unapproved</MenuItem>
                            <MenuItem value={'1'}>First Approval Done</MenuItem>
                      </Select>
                      </FormControl> 
                      </div>
                      </div>)
                    : (<div></div>)}
                     <div className='selector'>
                  <div className='input-pair'>
                    <FormLabel sx={{fontSize: 12}}>Include Characters linked to Specific LARP</FormLabel>
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
                          onChange={(e) => UpdateLarpAutoComp(e.target.value)}
                          placeholder="Select LARP"
                          variant="outlined"
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: <IconButton 
                              sx={{visibility: larpAutoCompValue !== '' && larpAutoCompValue !== null ? "visible": "hidden"}} 
                              onClick={() => UpdateLarpAutoComp('')}><Clear /></IconButton>}} 
                        />
                        )}
                        //getoptionselected={(opt, val) => opt === val}
                        onChange={(event, val) => selectLarpTag(val)}
                    />
                    </div>
                  </div>
                    <button className='button-cancel' disabled={btnDisabledState} onClick={() => clearfilters()}>Clear Filters</button>
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
                  <TableCell colSpan={props.selectedApproved ? 8 : 9}>
                      <div className='fullspan-cell'>
                      <div className='search-row'>
                      <div className='search-container'>
                                      <div className='filter-container'>
                                      <Tooltip title="Filter by Last Editor">
                       <button className='button-action-round' onClick={() => FilterOpen('Editor')}>
                       <SearchSharpIcon sx={{fontSize: 23}} />
                   </button>
                   </Tooltip>
                   <TextBox title={'Sheet Editor Name'} onClose={(e) => updateFilter(e, 'Editor')} value={props.Filters.EditorFilter !== undefined 
                        && props.Filters.EditorFilter !== null ?
                        props.Filters.EditorFilter : ''} open={dialogStates.Editor}/>
                        {props.Filters.EditorFilter !== undefined 
                        && props.Filters.EditorFilter !== null && props.Filters.EditorFilter !== ''?
                        props.Filters.EditorFilter : <div className='inactive-text'>Last Edited By</div>}

                  </div>
                  <hr/>
                  </div>
                  <div className='search-container'>
                  <div className='filter-container'>
                  <Tooltip title="Filter by Sheet Creator">
                  <button className='button-action-round' onClick={() => FilterOpen('Creator')}>
                  <SearchSharpIcon sx={{fontSize: 23}} />
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
                  <div className='search-container'>
                <div className='filter-container'>
                <Tooltip title="Filter by Character Name">
                  <button className='button-action-round' onClick={() => FilterOpen('Name')}>
                  <SearchSharpIcon sx={{fontSize: 23}} />
                   </button>
                   </Tooltip>
                   <TextBox title={'Character Name'} onClose={(e) => updateFilter(e, 'Name')} value={props.Filters.CharacterFilter !== undefined 
                        && props.Filters.CharacterFilter !== null ?
                        props.Filters.CharacterFilter : ''} open={dialogStates.Name}/>
                        {props.Filters.CharacterFilter !== undefined 
                        && props.Filters.CharacterFilter !== null  && props.Filters.CharacterFilter !== '' ?
                        props.Filters.CharacterFilter : <div className='inactive-text'>Character Name</div>}
                  </div>
                  <hr/>
                  </div>
                  <div className='search-container'>
                  <div className='filter-container'>                   
                    <Tooltip title="Filter by Series">
                  <button className='button-action-round' onClick={() => FilterOpen('Series')}>
                  <SearchSharpIcon sx={{fontSize: 23}} />
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
                      getOptionLabel={(option) => option !== undefined && option.name !== undefined ?
                        option.name : ''}
                      onChange={(event, val) => updateTags(val)}
                      renderInput={(params) => (
                        <TextField placeholder='filter tags' {...params} />
                      )}
                    />
                  </div>
                  </div>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow>
                    <TableCell className="short-column table-cell-center">Status</TableCell>
                    {props.selectedApproved ? <></> :
                    <TableCell className="short-column table-cell-center">Ready For Approval</TableCell>
                    }
                    <TableCell className="short-column table-cell-center">Sheet Comments</TableCell>
                    <TableCell>Character Name</TableCell>
                    <TableCell>Series</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>View</TableCell>
                    { props.authLevel > 1
                        ? <TableCell className="short-column">Edit</TableCell>: <></>}
                    { props.authLevel >=5 && props.selectedApproved
                          ? <TableCell className="short-column">Kick</TableCell> : <></>}
                    { props.authLevel > 5 && !props.selectedApproved 
                          ? <TableCell className="short-column">Delete</TableCell> : <></>}             
                    { props.authLevel > 2 && props.authLevel <6 && props.selectedApproved
                          ? <TableCell className="short-column"></TableCell> : <></>} 
                  </TableRow>
                </TableHead>
                <TableBody>
                  {displayState.apimessage.map((row) => ( 
                    <TableRow key={row.guid}>
                      <TableCell className='table-default-cursor table-cell-center'>
                        {
                          row.createdbyuserGuid !== null && row.firstapprovalbyuserGuid !== null && row.secondapprovalbyuserGuid !== null
                            ? <div className='' title="approved">
                            <HoverText  plainText={'A'} hoverText={"Edit By: " + row.editbyUser + "\n" + "1st App. By: " + row.firstApprovalUser + "\n" + "2nd App. By: " + row.secondApprovalUser}/>
                            </div>
                            : null
                        }
                        {
                          row.createdbyuserGuid !== null && row.firstapprovalbyuserGuid == null && row.secondapprovalbyuserGuid == null
                            ? <div className='' title="unapproved: needs 2 approvals"><HoverText  plainText={'U'} hoverText={"Edit By: " + row.editbyUser}/>
                        </div>
                            : null
                        }
                        {
                          row.createdbyuserGuid !== null && row.firstapprovalbyuserGuid !== null && row.secondapprovalbyuserGuid == null
                          ? <div className='' title="has 1st approval, needs 2nd approval">
                          <HoverText  plainText={'1st'} hoverText={"Edit By: " + row.editbyUser + "\n" + "1st App. By: " + row.firstApprovalUser}/>
                          </div>
                          : null
                        }
                      </TableCell>
                      {props.selectedApproved ? <></> :
                       <TableCell className='table-default-cursor table-cell-center'>
                        { row.readyforapproval !== null && row.readyforapproval === true ? "Yes" : "No"}
                       </TableCell>
                        }
                        <TableCell className='table-default-cursor table-cell-center'>
                          <div>{row.hasreview ? 'Yes':'No'}</div>
                        </TableCell>
                        <TableCell>
                        { props.authLevel > 0
                          ? <div className='titleInfo'>
                              {row.name}
                            </div>
                          : <div></div>
                        }
                      </TableCell>
                      <TableCell>
                        <div className='titleInfo'>{row.title}</div>
                      </TableCell>
                      <TableCell>
                        <Tags tags={row.tags} clickable={true} tagClick={(e) => tagClicked(e)}/>
                      </TableCell>
                      <TableCell>
                      <IconButton aria-label='edit' onClick={() => props.DirectToCharacter(props.selectedApproved ? 'CharacterSheetApproveds' 
                          : 'CharacterSheets', row.guid)}>
                      <ArrowCircleRightSharpIcon  className="table-icon-button" />
                          </IconButton>
                      </TableCell>
                      <TableCell>
                        { props.authLevel > 1
                          ? <div>
                            <IconButton aria-label='edit' onClick = {() => props.Edit(props.selectedApproved ? 'CharacterSheetApproveds' 
                          : 'CharacterSheets', row.guid)}>
                            <EditSharpIcon className="table-icon-button"/>
                            </IconButton>
                            </div>
                          : <div></div>
                        }
                      </TableCell>
                        { props.authLevel >= 5 && props.selectedApproved
                          ? <TableCell> <IconButton aria-label='kickback' onClick = {() => handleKickOpen(row)}>
                              <FastRewindSharpIcon className="table-icon-button" />
                            </IconButton>
                            </TableCell>
                          : <></>
                        }
                      
                        { props.authLevel > 5 && !props.selectedApproved ? 
                          <TableCell>
                            <IconButton aria-label='delete' onClick = {() => Delete(row)}>
                              <DeleteSharpIcon />
                            </IconButton>
                            </TableCell>
                          : <></>
                        }
                        
                     { props.authLevel > 2 && props.authLevel <6 && props.selectedApproved
                          ? <TableCell className="short-column"></TableCell> : <></>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

          {
          kickDialogOpen.row !== null
          ? <KickDialog  
          row={kickDialogOpen.row}
          handleKickClose={() => handleKickClose()}
          path ={{
              pathname: 'CharacterSheetApproveds',
              mutationName: 'characterKick',
              refreshName: ['listUnapprovedCharacters', 'listApprovedCharacters']
              }} /> 
          : <></>
           }

      { deleteDialogOpen.open ?
       <DeleteDialogFull 
        open={deleteDialogOpen.open} 
        data={deleteDialogOpen.data} 
        handleFullDeleteClose={() => handleDeleteClose()}
        apiPath={ 
          {path:'CharacterSheets', refreshName:'listUnapprovedCharacters', mutationName:'characterDelete' }}
           /> :<></> }

          </>
        )
      }
    }
    
    export default CharacterTable;
    
    CharacterTable.propTypes = {
    selectedApproved: PropTypes.bool,
    commentFilterOn: PropTypes.bool,
    showApprovableOnly: PropTypes.bool,
    readyApproved: PropTypes.bool,
    showallLARPLinked: PropTypes.bool,
    appdata: PropTypes.array,
      apiMessage: PropTypes.array,
      authLevel: PropTypes.number,
      ToggleSwitches: PropTypes.func,
      seriesfilterup: PropTypes.func,
      charfilterup: PropTypes.func,
      DeleteCharacter: PropTypes.func,
      DirectToCharacter: PropTypes.func,
      Edit: PropTypes.func,
      tagslist: PropTypes.array,
      larpTags: PropTypes.array,
      NewCharacterLink: PropTypes.func,
      GoToSearch: PropTypes.func,
      approvedState: PropTypes.array,
      userGuid: PropTypes.string,
      approvableOnly: PropTypes.bool,
      initFilter: PropTypes.string,
      UpdateFilter: PropTypes.func,
      isLoading: PropTypes.bool,
      Filters: PropTypes.object
    }

