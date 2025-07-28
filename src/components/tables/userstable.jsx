import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp'
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import RolesTable from './rolestable'
import './table.scss'
import PropTypes from 'prop-types';
import FilterIcon from '../icon/filtericon'

const UserTable = props => {

  const [clearfilterState, setClearfilterState] = useState(false);

  const [filterState, setFilterState] = useState('');
  const [filteredRowsState, setFilteredRowsState] = useState({
    rows:null,
    display: false});
  const [btnDisabledState, setBtnDisabledState] = useState(true);

  function removeDiacritics(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  useEffect(() => {
    
    let filteredRows = props.data;

    filteredRows = filteredRows.filter(
      item => (item.firstname !== null && item.firstname !== undefined && removeDiacritics(item.firstname.toLocaleLowerCase()).includes(removeDiacritics(filterState.toLocaleLowerCase()))) ||
      (item.lastname !== null && item.lastname !== undefined &&  removeDiacritics(item.lastname.toLocaleLowerCase()).includes(removeDiacritics(filterState.toLocaleLowerCase())))  ||
      (item.preferredname !== null && item.preferredname !== undefined &&  removeDiacritics(item.preferredname.toLocaleLowerCase()).includes(removeDiacritics(filterState.toLocaleLowerCase()))) ||
      (item.email !== null && item.email !== undefined &&  removeDiacritics(item.email.toLocaleLowerCase()).includes(removeDiacritics(filterState.toLocaleLowerCase())))
  );

    setFilteredRowsState({
        ...filteredRowsState,
        rows:filteredRows,
        display:true
      });
      setClearfilterState(false);

  }, [filterState, props.data]);

  const clearfilters = async() => {
    setClearfilterState(true);
    setFilterState('');
    setBtnDisabledState(true);
  }

  const updateFilter = async (e) => {
    try {
        await setFilterState(e)

        if (e !== '' || filterState !== '') {
          setBtnDisabledState(false);
        } else {
          setBtnDisabledState(true);
        }
      }
    catch (error) {
      console.log(error);
    }
  }

    return (
<>
<div>
  <TableContainer className='nexus-table'>
  <Table stickyHeader>
        <TableHead>
          <TableRow>
          <TableCell ></TableCell >
                        <TableCell ></TableCell >
                        <TableCell ></TableCell>
                        <TableCell>
                        <div className='table-topper-buttons'>     
                           <button className='button-cancel' disabled={btnDisabledState} onClick={clearfilters}>Clear Search</button>
                        </div>
                        </TableCell>
                        <TableCell > 
                        <div className='filter-container'>
                        <FilterIcon label="" clearfilter={clearfilterState} filterup={e => updateFilter(e)}/>
                        </div>
                        </TableCell >
                        { props.authlevel > 4
                          ? <TableCell ></TableCell>
                          : <></>
                        }
                    <TableCell></TableCell>
          </TableRow>
            <TableRow>
                        <TableCell >First Name</TableCell >
                        <TableCell >Last Name</TableCell >
                        <TableCell >Prefered Name</TableCell>
                        <TableCell>Pronouns</TableCell>
                        <TableCell >Email Address</TableCell >
                        { props.authlevel > 4
                          ? <TableCell >Edit User</TableCell>
                          : <></>
                        }
                    <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                {filteredRowsState.rows?.map((list, i) => (
                           <React.Fragment key={i}>
                            <TableRow key={i}>
                            <TableCell >
                                {list.firstname}
                            </TableCell>
                            <TableCell  >
                                {list.lastname}
                            </TableCell>
                            <TableCell >
                                {list.preferredname}
                            </TableCell>
                            <TableCell>
                                  {list.pronouns}
                            </TableCell>
                            <TableCell >
                                {list.email}
                            </TableCell>
                            { props.authlevel > 4
                              ? <TableCell>
                            <EditSharpIcon className="table-icon-button" onClick={() => props.GoToEdit(list.guid)} />
                            </TableCell>
                              : <></>}
                            <TableCell key={Math.random()}>
                            <div onClick={() => props.ArrowClick(list.guid)}>
                              {props.arrowsList.some(arrow => arrow.guid === list.guid && arrow.opened)
                               ? <>
                                <ArrowDropDownSharpIcon key={list.guid} className="show-hide-button"/> </>
                               : <>
                                <ArrowRightSharpIcon key={list.guid} className="show-hide-button"/> </>
                              } 
                              </div>
                            </TableCell> 
                            </TableRow>
                             {props.arrowsList.some(arrow => arrow.guid === list.guid && arrow.opened)
                              ? 
                              <React.Fragment key={Math.random()}>
                           {list.larpRoles.map(sublist => {
                             return (
                           <React.Fragment key={Math.random()}>
                            <TableCell className="table-inside-table" key={list.guid + Math.random()}>
                               <RolesTable props={sublist} key={sublist.larpGuid}/>
                            </TableCell>
                           </React.Fragment>
                             )
                              })

                        } </React.Fragment>
                              : <></> } 
                              </React.Fragment>
                ))}
                </TableBody>
                </Table>
                </TableContainer>
                </div>
        </>
      )   
}

export default UserTable

UserTable.propTypes = {
  authlevel: PropTypes.number,
  data: PropTypes.array,
  arrowsList: PropTypes.array,
  GoToEdit: PropTypes.func,
  ArrowClick: PropTypes.func,
}