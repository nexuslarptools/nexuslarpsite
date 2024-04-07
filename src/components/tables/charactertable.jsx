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
  FormLabel
} from '@mui/material';
import PropTypes from 'prop-types';
import FilterIcon from '../icon/filtericon';
import Tags from '../tags/tags';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import FastRewindSharpIcon from '@mui/icons-material/FastRewindSharp';
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp';
import Loading from '../../components/loading/loading';
import { Clear } from '@mui/icons-material';
import KickDialog from '../dialogs/kickdialogbox';
import DeleteDialogFull from '../dialogs/deletedialogcomplete';

const CharacterTable = props => {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(25);
    const [filterState, setFilterState] = useState({
        SeriesFilter: '',
        CharacterFilter: ''
      });
      const [tagState, setTagState] = useState({
        listTags: []
      });
    const [selectedLarpTag, setSelectedLarpTag] = useState(null);
    const [selectedApprovalState, setSelectedApprovalState]  = useState('');
    const [autocompSelectedValue, setAutocompSelectedValue] = useState(null);
    const [resetInputField, setResetInputField] = useState(false);
    const [larpAutoCompValue, setLarpAutoCompValue] = useState(null);
    const [btnDisabledState, setBtnDisabledState] = useState(true);
    const [tagSelectValues, setTagSelectValues] = useState([]);
    const [currentTagList, setCurrentTagList] = useState([]);
    const [clearfilterState, setClearfilterState] = useState(false);
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

      useEffect(() => {
        let tagDrowdownList = [];
        props.tagslist.forEach(tag => {
          if (tag.tagtypeguid === '26cd7510-9401-11ea-899a-4fd87913c65d') {
            tagDrowdownList.push(tag);
          }
        });
    
        if (selectedLarpTag !== null) {
          const fullSelectLARPTag = props.larpTags.find((tag) => tag.guid === selectedLarpTag);
          tagDrowdownList.push(fullSelectLARPTag);
        }
        setCurrentTagList(tagDrowdownList);

        let filteredRows = props.appdata;

        filteredRows = filteredRows.filter(item => item.name.toLocaleLowerCase().includes(filterState.CharacterFilter));
        filteredRows = filteredRows.filter(item => (item.series === null && filterState.SeriesFilter === '') 
          || (item.title !== null && item.title.toLocaleLowerCase().includes(filterState.SeriesFilter)));
        if (props.showApprovableOnly) {
          filteredRows = filteredRows.filter(item => (item.editbyUserGuid !== props.userGuid && item.firstapprovalbyuserGuid !== props.userGuid));
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
      }, [props.appdata, props.showallLARPLinked, props.showApprovableOnly, props.commentFilterOn,
        filterState, tagState, selectedLarpTag, selectedApprovalState, page, rowsPerPage]);

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

      const updateFilter = async (e, updatedfeild) => {
        try {
          if (updatedfeild === 'Name') {
            await setFilterState({
              ...filterState,
              CharacterFilter: e
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
        } catch (error) {
          console.log(error);
        }
      }

      const UpdateApprovalFilter = async (e) => {
        setSelectedApprovalState(e.target.value);
      }

      const updateTags = (e) => {
        const listguids = []
        e.forEach(element => {
          listguids.push(element.guid)
        });
        setTagState({
          ...tagState,
          listTags: listguids
        });
    
        setTagSelectValues(e);
    
        if (filterState.CharacterFilter !== '' || filterState.SeriesFilter !== '' || listguids.length > 0) {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }

      const tagClicked = (e) => {
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
        if (newtag !== undefined && (tagSelectValues.length === 0 || tagSelectValues.findIndex((element) => element.guid === e) === -1)) {
          const setNewTagslist = tagSelectValues;
          setNewTagslist.push(newtag);
          setTagSelectValues(setNewTagslist);
        }
    
        if (filterState.TitleFilter !== '' || filterState.TitleJpnFilter !== '' || listguids.length > 0) {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }

    const clearfilters = async () => {
        await setFilterState({
            ...filterState,
            SeriesFilter: '',
            CharacterFilter: ''
          });
          setBtnDisabledState(true);
          setTagState({
            ...tagState,
            listTags: []
          });
          await setFilterState({
            ...filterState,
            CharacterFilter: '',
            SeriesFilter: ''
          });
          setTagSelectValues([]);
          await setClearfilterState(true);
          await setClearfilterState(false);
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
  

    if (props === undefined || props.authLevel < 1 || !displayState.display ) {
        return (<div className='loading-container'><Loading /></div>)
      } else {
        return (
          <>
            <TableContainer className='characterTable nexus-table'>
              <Table>
                <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
                    <TableRow>
                    <TableCell  className='table-topper'>
                    <button className='button-action' onClick={(e) => props.NewCharacterLink(e)}>Add New Character</button>
                    </TableCell>
                    <TableCell className='table-topper'>
                     </TableCell>
                    <TableCell className='table-topper'>
                     { props.authLevel > 1
                      ? <FormControlLabel control={ <Switch defaultChecked onChange={() => props.ToggleSwitch()} /> }
                            label={props.selectedApproved ? 'Approved Characters' : 'Unapproved Characters'} />
                      : <div></div>
                    }
                    </TableCell>
                    <TableCell className='table-topper'>
                  <FormControlLabel control={ <Switch defaultChecked onChange={() => props.ToggleCommentSwitch()} /> }
                            label={props.commentFilterOn ? 'Only Commented Sheets' : 'All Sheets'} />
                    </TableCell>
                    <TableCell className='table-topper'>
                    {props.authLevel > 2 && !props.selectedApproved? (
                      <FormControlLabel control={ <Switch defaultChecked onChange={() => props.ToggleApprovableSwitch()} /> }
                        label={props.showApprovableOnly ? 'Characters You Can Approve' : 'All Unapproved Characters'} /> )
                    : (<div></div>)}
                     </TableCell>
                     <TableCell className='table-topper' colSpan={4}>
                        <></>
                     </TableCell>
                    </TableRow>
                <TableRow>
                <TableCell colSpan={3} className='table-topper'>
                    {props.authLevel > 2 && !props.selectedApproved? (
                       <div className='input-pair'>
                       <FormControl fullWidth>
                       <InputLabel id="demo-simple-select-label">Select Sheet Status
                       </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        //value={age}
                        label="Sheet Status"
                        onChange={e => UpdateApprovalFilter(e)}>
  <MenuItem value={''}>All Approval States</MenuItem>
  <MenuItem value={'U'}>Unapproved</MenuItem>
  <MenuItem value={'1'}>First Approval Done</MenuItem>
                      </Select>
                      </FormControl> 
                      </div>)
                    : (<div></div>)}
                 </TableCell>
                  <TableCell colSpan={1} className='table-topper'>
                  <div className='input-pair'>
                    <FormLabel>Include Characters linked to Specific LARP</FormLabel>
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
                        getOptionSelected={(opt, val) => opt === val}
                        onChange={(event, val) => selectLarpTag(val)}
                    />
                  </div>
                </TableCell>
                <TableCell className='table-topper'>
                    <button className='button-cancel' disabled={btnDisabledState} onClick={() => clearfilters()}>Clear Filters</button>
                </TableCell>
                <TableCell className='table-topper' colSpan={props.authLevel === 5 ? 4:5} >
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
                    <TableCell className="short-column table-cell-center">Status</TableCell>
                    {props.selectedApproved ? <></> :
                    <TableCell className="short-column table-cell-center">Ready For Approval</TableCell>
                    }
                    <TableCell className="short-column table-cell-center">Sheet Comments</TableCell>
                    <TableCell>Series</TableCell>
                    <TableCell>Character Name</TableCell>
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
                  <TableRow className='table-filter-row'>
                    
                  </TableRow>
                  <TableRow className='table-filter-row'>
                {props.selectedApproved  ?
                       <TableCell></TableCell> : <TableCell colSpan={2}></TableCell>
                  }
                {props.commentFilterOn !== undefined ?  <TableCell></TableCell> : <></>}
                <TableCell>
                  <div className='filter-container'>
                    <FilterIcon label="series" clearfilter={clearfilterState} filterup={e => updateFilter(e, 'Series')}/>
                  </div>
                </TableCell>
                <TableCell>
                  <div className='filter-container'>
                    <FilterIcon label="name" clearfilter={clearfilterState} filterup={e => updateFilter(e, 'Name')}/>
                  </div>
                </TableCell>
                <TableCell colSpan={props.selectedApproved  && props.authLevel > 5 ? 3 :
                  props.selectedApproved  && props.authLevel <= 3 ? 2 :
                  !props.selectedApproved && props.authLevel > 2 ? 2  : 1  }>
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
                {props.authLevel > 1 && !props.selectedApproved  ? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 }
                {!props.selectedApproved  || props.authLevel <= 5? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 }
                {props.selectedApproved  && props.authLevel >= 5 ? 
                <>
                <TableCell ></TableCell> 
                </> :<></>
                 }


              </TableRow>
                </TableHead>
                <TableBody>
                  {displayState.apimessage.map((row) => ( 
                    <TableRow key={row.guid}>
                      <TableCell className='table-default-cursor table-cell-center'>
                        {
                          row.createdbyuserGuid !== null && row.firstapprovalbyuserGuid !== null && row.secondapprovalbyuserGuid !== null
                            ? <div className='' title="approved">A</div>
                            : null
                        }
                        {
                          row.createdbyuserGuid !== null && row.firstapprovalbyuserGuid == null && row.secondapprovalbyuserGuid == null
                            ? <div className='' title="unapproved: needs 2 approvals">U</div>
                            : null
                        }
                        {
                          row.createdbyuserGuid !== null && row.firstapprovalbyuserGuid !== null && row.secondapprovalbyuserGuid == null
                          ? <div className='' title="has 1st approval, needs 2nd approval">1st</div>
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
                        <div className='titleInfo'>{row.title}</div>
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
    showallLARPLinked: PropTypes.bool,
    appdata: PropTypes.array,
      apiMessage: PropTypes.array,
      authLevel: PropTypes.number,
      ToggleSwitch: PropTypes.func,
      ToggleCommentSwitch: PropTypes.func,
      ToggleApprovableSwitch: PropTypes.func,
      seriesfilterup: PropTypes.func,
      charfilterup: PropTypes.func,
      DeleteCharacter: PropTypes.func,
      DirectToCharacter: PropTypes.func,
      Edit: PropTypes.func,
      tagslist: PropTypes.array,
      larpTags: PropTypes.array,
      NewCharacterLink: PropTypes.func,
      approvedState: PropTypes.array,
      userGuid: PropTypes.string,
      approvableOnly: PropTypes.bool,
      initFilter: PropTypes.string
    }

