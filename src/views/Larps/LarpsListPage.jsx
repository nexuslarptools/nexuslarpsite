import EditSharpIcon from '@mui/icons-material/EditSharp'
import ArrowRightSharpIcon from '@mui/icons-material/ArrowRightSharp';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer } from "@mui/material"
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';
import LarpUserRolesTable from '../../components/tables/larpusersroletable';

export default function LarpsListPage(props) {

  const [arrowsState, setArrowsState] = useState({
    arrowsList: [],
    showResult: false
  });

  useEffect(() => {
    const fillin = []
    props.data.forEach(name => {
      fillin.push({ guid: name.guid, opened: false });
    })
    setArrowsState({
      arrowsList: fillin
    })
  }, [])

  const ArrowClickHandler = (e) => {
    const fillin = [];
    arrowsState.arrowsList.forEach(name => {
      if (name.guid === e && name.opened) {
        name.opened = false;
      } else if (name.guid === e && !name.opened) {
        name.opened = true;
      }
      fillin.push(name);
    })
    setArrowsState({
      arrowsList: fillin
    })
  }

  return (
    <>
      <div className="page">
        <TableContainer className="nexus-table">
          <Table stickyHeader>
            <TableHead>
                <TableRow>
                  <TableCell>LARP</TableCell>
                  <TableCell>Location</TableCell>
                  {props.authLevel > 4
                    ? 
                      <TableCell>
                          <button onClick={() => props.GoToNewEdit(null)} className='button-action'>Add New LARP</button>
                      </TableCell>
                    : <div></div>
                  }
                  { props.authLevel > 5
                    ? <TableCell className='short-column table-cell-center'>Edit Info</TableCell>
                    : <></>
                  }
                  <TableCell className='short-column table-cell-center'>Users</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map(list => {
                return (
                  <>
                    <TableRow key={list.guid} >
                      <TableCell key={list.guid + list.name + Math.random()}>
                          {list.name} ({list.shortname})
                      </TableCell>
                      <TableCell key={list.guid + list.location + Math.random()}>
                          {list.location}
                      </TableCell>
                      {props.authLevel > 4
                        ? <TableCell></TableCell>
                        : <div></div>
                      }
                      { props.authLevel > 5
                        ? <TableCell key={list.guid + ' edit ' + Math.random()} className='table-cell-center'>
                            <EditSharpIcon 
                              className="table-icon-button" 
                              onClick={() => props.GoToNewEdit(list.guid)} />
                          </TableCell>
                        : <></>
                      }
                      { list.users.length > 0 
                        ? <TableCell key={Math.random()} className='table-cell-clickable table-cell-center'>
                          { arrowsState.arrowsList.some(arrow => arrow.guid === list.guid && arrow.opened)
                            ? <><ArrowDropDownSharpIcon key={list.guid} className="show-hide-button" onClick={() => ArrowClickHandler(list.guid)}/></>
                            : <><ArrowRightSharpIcon key={list.guid} className="show-hide-button" onClick={() => ArrowClickHandler(list.guid)}/></>
                          }
                          </TableCell>
                        : <TableCell></TableCell>
                      }
                      
                    </TableRow>

                    { arrowsState.arrowsList.some(arrow => arrow.guid === list.guid && arrow.opened)
                      ? <> 
                        <TableRow key={list.guid + Math.random()}>
                          <TableCell colSpan={props.authLevel > 5 ? 5 : 4} className="table-inside-table" key={list.guid + Math.random()}>
                            <LarpUserRolesTable props={list.users} key={Math.random()} authLevel={props.authLevel}
                            GoToUserEdit={(guid) => props.GoToUserEdit(guid) } />
                          </TableCell>
                        </TableRow>
                      </>
                      : <></> 
                    }
                    {arrowsState.arrowsList.some(arrow => arrow.guid === list.guid && arrow.opened)
                      ? <></>
                      : <></> }
                  </>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}

LarpsListPage.propTypes = {
    DeleteTag: PropTypes.func,
    onOptionClicked: PropTypes.func,
    GoToNewEdit: PropTypes.func,
    authLevel: PropTypes.number,
    data: PropTypes.array,
    dropDownArray: PropTypes.array,
    dropdownSelect: PropTypes.string,
    GoToUserEdit: PropTypes.func
  }