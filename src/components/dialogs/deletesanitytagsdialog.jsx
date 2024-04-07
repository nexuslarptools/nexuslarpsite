import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import PropTypes from 'prop-types'
import useGetData from "../../utils/getdata";
import Loading from "../loading/loading";
import DeleteDialogFull from "./deletedialogcomplete";

export default function DeleteSanityTagsDialog(props) {


const sanityResults = useGetData('listSanityTags', '/api/v1/Tags/LinkedCharactersAndItems/' + props.guid);


  const handleDeleteClose = async () => {
    props.GoBack();
  }

if (sanityResults.isLoading) 
  return (<div>
      <Loading />
  </div>)
if (sanityResults.isError) return (<div>
      Error!
      </div>)


return (
    <>
    { sanityResults.data.characterLists.approvedCharacterSheets.length > 0  || 
    sanityResults.data.characterLists.unapprovedCharacterSheets.length > 0  ||
    sanityResults.data.itemLists.approvedItems.length > 0  ||
    sanityResults.data.itemLists.unapprovedItems.length > 0  || 
    sanityResults.data.seriesList.series.length > 0 ?
    <>
    <Dialog
        onClose={() => handleDeleteClose()}
        aria-labelledby="customized-dialog-title"
        open={props.isOpen}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Delete {props.name} Error:
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => handleDeleteClose()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500]
          }}
        >
        </IconButton>
        <DialogContent>
        <div>
{sanityResults.data.characterLists.approvedCharacterSheets.length > 0
  ? <div>
    <TableContainer>
    <Table>
        <TableHead>
          The following approved characters have this tag:
        </TableHead>
        <TableBody>
            {sanityResults.data.characterLists.approvedCharacterSheets.map((row) => (
                 <TableRow key={row.guid + Math.random().toString()}>
                 <TableCell>
                    {row.name}
                 </TableCell>
             </TableRow>
            ))
            }
        </TableBody>
  </Table>
  </TableContainer>
  </div>
  : <div></div>
   }
   {sanityResults.data.characterLists.unapprovedCharacterSheets.length > 0
     ? <div>
      <TableContainer>
    <Table>
        <TableHead>
        The following unapproved characters have this tag:
        </TableHead>
        <TableBody>
            {sanityResults.data.characterLists.unapprovedCharacterSheets.map((row) => (
                 <TableRow key={row.guid + Math.random().toString()}>
                 <TableCell>
                    {row.name}
                 </TableCell>
             </TableRow>
            ))
            }
        </TableBody>
  </Table>
  </TableContainer>
    </div>
     : <div></div>
     }
        {sanityResults.data.itemLists.approvedItems.length > 0
          ? <div>
      <TableContainer>
    <Table>
        <TableHead>
        The following approved items have this tag:
        </TableHead>
        <TableBody>
            {sanityResults.data.itemLists.approvedItems.map((row) => (
                 <TableRow key={row.guid + Math.random().toString()}>
                 <TableCell>
                    {row.name}
                 </TableCell>
             </TableRow>
            ))
            }
        </TableBody>
  </Table>
  </TableContainer>
    </div>
          : <div></div>
     }
        {sanityResults.data.itemLists.unapprovedItems.length > 0
          ? <div>
      <TableContainer>
    <Table>
        <TableHead>
        The following unapproved items have this tag:
        </TableHead>
        <TableBody>
            {sanityResults.data.itemLists.unapprovedItems.map((row) => (
                 <TableRow key={row.guid + Math.random().toString()}>
                 <TableCell>
                    {row.name}
                 </TableCell>
             </TableRow>
            ))
            }
        </TableBody>
  </Table>
  </TableContainer>
    </div>
          : <div></div>
     }
        {sanityResults.data.seriesList.series.length > 0
          ? <div>
      <TableContainer>
    <Table>
        <TableHead>
        The following series have this tag:
        </TableHead>
        <TableBody>
            {sanityResults.data.seriesList.series.map((row) => (
                 <TableRow key={row.guid + Math.random().toString()}>
                 <TableCell>
                    {row.name}
                 </TableCell>
             </TableRow>
            ))
            }
        </TableBody>
  </Table>
  </TableContainer>
    </div>
          : <div></div>
     }
</div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={() => handleDeleteClose()}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      </> :
       <DeleteDialogFull 
        open={props.isOpen} 
        data={{guid: props.guid,
        name:props.name}} 
        handleFullDeleteClose={() => handleDeleteClose()}
        apiPath={{path:'Tags', refreshName:'listTags', mutationName:'tagsDelete' }} /> }
      </>
)
    }

    DeleteSanityTagsDialog.propTypes = {
      GoBack: PropTypes.func,
      SubmitForm: PropTypes.func,
      data:  PropTypes.object,
      larpList:  PropTypes.array,
      dropDownArray: PropTypes.array,
      guid: PropTypes.string,
      name: PropTypes.string,
      isOpen: PropTypes.bool
    }