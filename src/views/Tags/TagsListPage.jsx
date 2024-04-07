import EditSharpIcon from '@mui/icons-material/EditSharp'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'
import { Table, TableBody, TableCell, TableHead, TableRow, TableContainer, FormLabel, IconButton } from "@mui/material"
import PropTypes from 'prop-types'
import { useState } from 'react';
import DeleteSanityDialog from '../../components/dialogs/deletesanitydialog';

export default function TagsListPage(props) {

  const [fullDeleteDialogOpen, setFullDeleteDialogOpen] = useState({
    row: null,
    open: false
  });

  const DeleteTag = async (e) => {
    setFullDeleteDialogOpen({
      row: e,
      open: true
    })
  }
    return (
        <>
        <TableContainer className='nexus-table'>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell colSpan={1} className='table-topper'>
        <div className='table-topper-buttons'>
        { props.authLevel > 4 ?
        <button onClick={() => props.GoToNewEdit()} className='button-action'> Make New Tag </button>
        : 
        <></>}
        </div>
        <div className="input-pair">
        <FormLabel htmlFor="pronouns">Tag Type</FormLabel>
             <select
              id="tagTypeSelector"
              value={props.dropdownSelect}
              label='Tag Type'
              onChange={(e) => props.onOptionClicked(e.target.value)}>
              {props.dropDownArray.map(option => (
                <option className={'TagType'} key={option.guid} value={option.name}>{option.name}</option>
              ))
              }
              </select>

           </div>
            </TableCell>
            <TableCell  colSpan={3} className='table-topper' />
            </TableRow>

              <TableRow key="Tagslist">
                <TableCell key={Math.random()}>Name</TableCell>
                <TableCell key={Math.random()}>Locked To</TableCell>
                <TableCell>{props.authLevel > 5 ? 'Edit': ''}</TableCell>
                <TableCell>{props.authLevel === 6 ? 'Delete': ''}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((list) => {
                return (
                  <TableRow key={list.guid}>
                    <TableCell key={list.guid + list.name}>{list.name}</TableCell>
                    <TableCell key={list.guid + 'list'}>
                      {list.larpsTagLockedTo
                        ? list.larpsTagLockedTo.map((larps) => {
                          return larps.name
                        })
                        : 'none'}
                    </TableCell>
                    <TableCell key={list.guid + 'edit'}>
                    {props.authLevel >=4
                      ? <div>
                        <EditSharpIcon className="table-icon-button" onClick={() => props.GoToNewEdit(list.guid)}/>
                      </div> :  
                      <></>
                    }
                    </TableCell>
                    <TableCell>
                    {props.authLevel === 6
                      ? <div>
                    <IconButton aria-label='delete' onClick = {() => DeleteTag(list)}>
                              <DeleteSharpIcon />
                            </IconButton>
                      </div>
                      : <div></div>}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          </TableContainer>

         { fullDeleteDialogOpen.open ?
       <DeleteSanityDialog 
            guid={fullDeleteDialogOpen.row.guid}
            name={fullDeleteDialogOpen.row.name}
            path={'Tags/LinkedCharactersAndItems/'}
            apiPath={{path:'Tags', refreshName:'listTags', mutationName:'tagsDelete' }}
            sanityMutation={'listSanityTags'}
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

TagsListPage.propTypes = {
    onOptionClicked: PropTypes.func,
    GoToNewEdit: PropTypes.func,
    authLevel: PropTypes.number,
    data: PropTypes.array,
    dropDownArray: PropTypes.array,
    dropdownSelect: PropTypes.string
  }