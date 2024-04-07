import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { TableContainer, Table, TableHead, TableRow, TableBody, TableCell } from '@mui/material';
import EditSharpIcon from '@mui/icons-material/EditSharp';

const LarpUserRolesTable = props => {

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

  if (!propsState.showResult && propsState.apiMessage.count !== 0) {
    return <></>
  } else {
    return (
      <>
        <TableContainer className="nexus-table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                {props.authLevel > 5 ? <TableCell></TableCell> : <></>}
              </TableRow>
            </TableHead>
            <TableBody>
              {propsState.apiMessage.props.map(list => {
                return (
                  <TableRow key={list.guid}>
                    <TableCell key={Math.random()}>
                        {list.firstname}&nbsp;{list.lastname}&nbsp;({list.preferredname})
                    </TableCell>
                    <TableCell>{list.email}</TableCell>
                    <TableCell>{list.effectiveRole.roleName}</TableCell>
                    {
                      props.authLevel > 5
                        ? <TableCell className='table-cell-center'>
                              <EditSharpIcon className="table-icon-button" onClick={() => props.GoToUserEdit(list.guid)} />
                          </TableCell>
                        : <></>
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

export default LarpUserRolesTable;

LarpUserRolesTable.propTypes = {
  authLevel: PropTypes.number,
  DBWizardAuth: PropTypes.bool,
  DeleteItem: PropTypes.func,
  GoToUserEdit: PropTypes.func
}