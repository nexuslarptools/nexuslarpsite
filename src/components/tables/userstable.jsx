import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp'
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp'
import EditSharpIcon from '@mui/icons-material/EditSharp'
import RolesTable from './rolestable'
import './table.scss'
import PropTypes from 'prop-types';

const UserTable = props => {

    return (
<>
<div>
  <TableContainer className='nexus-table'>
  <Table stickyHeader>
        <TableHead>
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
                {props.data.map((list, i) => (
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