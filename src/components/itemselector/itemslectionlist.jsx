import PropTypes from 'prop-types';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import HighlightOffSharpIcon from '@mui/icons-material/HighlightOffSharp';
import RemoveSharpIcon from '@mui/icons-material/RemoveSharp';
import AddSharpIcon from '@mui/icons-material/AddSharp';
import ItemPopover from '../popovers/itempopover';
import './_itemselectionlist.scss'

const ItemSelectonList = (props) => {

    return (
        <>
       <div className="selection-list-list">
        <TableContainer style={{
      maxHeight: window.innerHeight - 178 ,
    }}>
          <Table stickyHeader>
          <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
        <TableRow>
        { props.allowMultiples ?
            <TableCell>
              Item Count
            </TableCell> :
            <></>  }
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              Approved?
            </TableCell>
            <TableCell> 
            </TableCell>
        </TableRow>
        </TableHead>
        <TableBody>
            {
                props.List.map(item => {
                    return (
                        <>
                    <TableRow>
                      { props.allowMultiples ?
                    <TableCell>
                        { item.count > 1?
                    <RemoveSharpIcon className="table-icon-button-small" fontSize="small" 
                     onClick={() =>props.LowerCount(item.guid)} /> 
                     : <></>
                       }
                      {item.count}
                      <AddSharpIcon className="table-icon-button-small" fontSize="small" 
                        onClick={() =>props.IncreaseCount(item.guid)} />
                    </TableCell> :<></> }
                    <TableCell>
                      <ItemPopover guid={item.guid} name={item.name} />
                    </TableCell>
                    <TableCell>
                      {
                        item.path === 'ItemSheets' ? 
                        'N' :
                        'Y'
                      }
                    </TableCell>
                    <TableCell>
                        <HighlightOffSharpIcon className="table-icon-button" onClick={() =>props.RemoveItem(item.guid)}/>
                    </TableCell>
                    </TableRow>
                    </>
                )
            })
            }
        </TableBody>
          </Table>
        </TableContainer>
        </div>
        </>
    )
}

export default ItemSelectonList;

ItemSelectonList.propTypes = {
    List: PropTypes.array,
    allowMultiples: PropTypes.bool,
    RemoveItem: PropTypes.func,
    LowerCount: PropTypes.func,
    IncreaseCount: PropTypes.func,
}