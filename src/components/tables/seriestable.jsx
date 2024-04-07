import { Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Stack, TablePagination, Autocomplete, TextField } from '@mui/material'
import ArrowCircleRightSharpIcon from '@mui/icons-material/ArrowCircleRightSharp'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import PropTypes from 'prop-types'
import { useState } from 'react'
import FilterIcon from '../icon/filtericon'
import filterSeries from '../../utils/filters'
import Tags from '../tags/tags'
import DeleteSanityDialog from '../dialogs/deletesanitydialog'

const SeriesTable = props => {

  const [btnDisabledState, setbtnDisabledState] = useState(true);
  const [tagSelectValues, setTagSelectValues] = useState([]);
  const [tagState, setTagState] = useState({
    listTags: []
  });
  const [titleFilterState, setTitleFilterState] = useState('');
  const [jpntitleFilterState, setJpnTitleFilterState] = useState('');
  const [rowsPerPageState, setRowsPerPageState] = useState(25);
  const [pageState, setPageState] = useState(0);
  const [clearFilerState, setClearFilerState] = useState(false);
  const [fullDeleteDialogOpen, setFullDeleteDialogOpen] = useState({
    row: null,
    open: false
  });

  const clearfilters = async () => {
    await setTitleFilterState('');
    await setJpnTitleFilterState('');
    await setTagState({
      listTags: []
    });
    await setTagSelectValues([]);
    await setbtnDisabledState(true);
    await setClearFilerState(true);
    await setClearFilerState(false);
  }

  const updateFilter = async (e, filtertype) => {

    if (filtertype === 'Title')
    {
      if (e !== '' || jpntitleFilterState !== '') {
        setbtnDisabledState(false);
      }
      else {
        setbtnDisabledState(true);
      }
    await setTitleFilterState(e);
    }

    if (filtertype === 'TitleJpn')
    {
      if (e !== '' || jpntitleFilterState !== '') {
        setbtnDisabledState(false);
      }
      else {
        setbtnDisabledState(true);
      }
    await setJpnTitleFilterState(e);
    }
  }

  const handleChangePage = (
    event,
    newPage
  ) => {
    setPageState(newPage);
  }

  const handleChangeRowsPerPage = (
    event
  ) => {
    setRowsPerPageState(parseInt(event.target.value, 10));
    setPageState(0);
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

    if (jpntitleFilterState !== '' || titleFilterState !== '' || listguids.length > 0) {
      setbtnDisabledState(false);
    } else {
      setbtnDisabledState(true);
    }
  }

  const tagClicked = (e) => {
    const listguids = tagState.listTags;
    if (listguids.findIndex((guid) => guid === e) === -1) {
    listguids.push(e);
    }

    setTagState({
      ...tagState,
      listTags: listguids
    });

    const newtag = props.tagsList.tagsList.find((element) => element.guid === e )
    const setNewTagslist = tagSelectValues;

    if (setNewTagslist.findIndex((tag) => tag.guid === e) === -1) {
    setNewTagslist.push(newtag);
    }

    setTagSelectValues(setNewTagslist);

    if (titleFilterState !== '' || jpntitleFilterState !== '' || listguids.length > 0) {
      setbtnDisabledState(false);
    } else {
      setbtnDisabledState(true);
    }
  }

  const Delete = async (e) => {
    setFullDeleteDialogOpen({
      row: {
        guid: e.guid,
        name: e.title
      },
      open: true
    })
  }

return (
    <>
    <TableContainer className='nexus-table'>
    <Table>
    <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
    <TableRow>
                <TableCell colSpan={6} className='table-topper'>
                  <div className='table-topper-buttons'>
                    <button className='button-action' onClick={() => props.NewSeries()}>Add New Series</button>
                    <button className='button-cancel' disabled={btnDisabledState} 
                      onClick={clearfilters}>Clear Filters</button>
                  </div>
                  <TablePagination
                    component="div"
                    count={filterSeries(props.data.seriList, 
                      titleFilterState, jpntitleFilterState, tagState, rowsPerPageState, pageState).total}
                    page={pageState}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPageState}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </TableCell>
              </TableRow>
        <TableRow>
        <TableCell>  Title </TableCell>  
        <TableCell> Japanese Title  </TableCell>
        <TableCell>
           Tags
        </TableCell> 
        <TableCell>
           Series Info
        </TableCell> 
        <TableCell>
           Edit
        </TableCell> 
        <TableCell>
        {props.authLevel > 5 
           ? 'Delete'
           : <></> }
        </TableCell> 
        </TableRow>
        <TableRow className='table-filter-row'>
            <TableCell>
              <div className='filter-container'>
                <FilterIcon label="Title" clearfilter={clearFilerState} 
                  filterup={e => updateFilter(e, 'Title')}/>
              </div>
            </TableCell>
            <TableCell>
              <div className='filter-container'>
                <FilterIcon label="Japanese Title" clearfilter={clearFilerState} 
                  filterup={e => updateFilter(e, 'TitleJpn')}/>
              </div>
                </TableCell>
                <TableCell colSpan={3}>
                  <div className='input-pair'>
                    <Autocomplete
                      multiple
                      key={clearFilerState}
                      value={tagSelectValues}
                      id="multiple-limit-tags"
                      options={props.tagsList.tagsList}
                      getOptionLabel={(option) => option.name}
                      onChange={(event, val) => updateTags(val)}
                      renderInput={(params) => (
                        <TextField placeholder='filter tags' {...params} />
                      )} />
                  </div>
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
        </TableHead>
        <TableBody key={'body'}>
        {filterSeries(props.data.seriList, 
      titleFilterState, jpntitleFilterState, tagState, rowsPerPageState, pageState).rows
        .filter(series => series.title !== '').map((series) => (
        <TableRow key={series.guid}>
        <TableCell> {series.title} </TableCell>  
        <TableCell> {series.titlejpn} </TableCell>
        <TableCell>
        <Stack direction="row">
       {/* {series.tags.map((tag) => ( */}
        <Tags tags={series.tags} clickable={true} tagClick={(e) => tagClicked(e)}/>
       {/* <Chip key={tag.guid} label={tag.name} sx={{m: .2}}/>
        ))} */}
        </Stack>
        </TableCell>
        <TableCell>
        <ArrowCircleRightSharpIcon onClick={() => props.DirectToSeries('Series', series.guid)}/>
        </TableCell>
        <TableCell>
          <EditSharpIcon className="table-icon-button" onClick={() => props.GoToEdit(series.guid)} />
        </TableCell> 
        <TableCell>
           {props.authLevel > 5
             ? <div>
              <DeleteSharpIcon onClick = {() => Delete(series)} />
              </div>
              : <div></div>}
        </TableCell> 
        </TableRow>
        ))}
        </TableBody>
        </Table>
        </TableContainer>

        { fullDeleteDialogOpen.open ?
       <DeleteSanityDialog 
            guid={fullDeleteDialogOpen.row.guid}
            name={fullDeleteDialogOpen.row.name}
            path={'Series/LinkedCharactersAndItems/'}
            apiPath={{path:'Series', refreshName:'listSeries', mutationName:'seriesDelete' }}
            sanityMutation={'listSanitySeries'}
            isOpen={fullDeleteDialogOpen.open}
            GoBack={() => setFullDeleteDialogOpen({
                  row: null,
                  open: false
                })}
                />
                : <></>
                }
    </>
)
}

export default SeriesTable

SeriesTable.propTypes = {
  MakeNewSeries: PropTypes.func,
  SubmitForm: PropTypes.func,
  data:  PropTypes.object,
  tagsList: PropTypes.object,
  larpList:  PropTypes.array,
  dropDownArray: PropTypes.array, 
  open: PropTypes.bool,
  handleFullDeleteClose: PropTypes.func,
  CompleteDelete: PropTypes.func,
  NewSeries:  PropTypes.func,
  apiPath: PropTypes.object,
  currPage: PropTypes.number,
  numberPerPage: PropTypes.number,
  LoadPrevSeries: PropTypes.func,
  LoadMoreSeries: PropTypes.func,
  NumberPerPageChange: PropTypes.func,
  DirectToSeries: PropTypes.func,
  GoToEdit: PropTypes.func,
  DeleteSeries: PropTypes.func,
  authLevel: PropTypes.number
}