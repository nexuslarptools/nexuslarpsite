import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import PropTypes from 'prop-types';

const RolesTable = props => {
  const [propsState, setPropsState] = useState({
    showResult: false,
    apiMessage: [],
    error: null
  });

  useEffect(() => {
    setPropsState({
      ...propsState,
      apiMessage: props,
      showResult: true
    })
  }, []);

  const removeRole = (e, f) => {
    props.RemoveCommand(e, f);
  }

  if (!propsState.showResult && propsState.apiMessage.length < 1) {
    return <></>
  } else {
    return (
      <>
        <TableContainer className="nexus-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell key={Math.random()} colSpan={5} className='table-cell-center'>
                  LARP:&nbsp;
                  {propsState.apiMessage.props.larpName}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {propsState.apiMessage.props.roles.map(list => {
                return (
                  <TableRow key={list.roleID}>
                    <TableCell key={Math.random()} className='table-cell-center'>
                        {list.roleName}
                    </TableCell>
                    {
                        props.edit && (props.authLevel > 5 || list.roleID < 4 ) ? <td><button className='button-cancel' onClick={() => removeRole(propsState.apiMessage.props.larpGuid, list.roleID)}>Remove</button></td> : <></>
                    }
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )
  }
}

export default RolesTable;

RolesTable.propTypes = {
  RemoveCommand: PropTypes.func,
  edit: PropTypes.bool,
  authLevel: PropTypes.number
}