import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import PropTypes from 'prop-types'
import  DeleteData from "../../utils/deletedata";
import { useEffect, useState } from "react";

export default function DeleteDialogFull(props) {

    const[deleteGuid, setDeleteGuid] = useState('')
    const[deletePath, setDeletePath] = useState({
        path: '',
        refreshName: '',
        mutationName: ''
    })

    
     useEffect(() => {
        async function loadData () {
            await setDeleteGuid(props.data.guid) 
            await setDeletePath({
                    path: props.apiPath.path,
                    refreshName: props.apiPath.refreshName,
                    mutationName: props.apiPath.mutationName,
                })
    }
loadData()
    }, [props.data, props.apiPath])


    const CompleteDelete = async () => {
        await currTagMutation.mutate()
        props.handleFullDeleteClose()
      }

  const currTagMutation = DeleteData('/api/v1/' + deletePath.path + '/' + deleteGuid, [deletePath.mutationName, deletePath.refreshName])

return (   
<>
     <Dialog
    onClose={() => props.handleFullDeleteClose()}
    aria-labelledby="customized-dialog-title"
    open={props.open}>
    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
    Delete {props.data.name}?
    </DialogTitle>
    <IconButton
      aria-label="close"
      onClick={() => props.handleFullDeleteClose()}
      sx={{
        position: 'absolute',
        right: 8,
        top: 8,
        color: (theme) => theme.palette.grey[500]
      }}
    >
    </IconButton>
    <DialogContent dividers>
      <Typography gutterBottom>
        Are you SURE you want to delete this item?
        This cannot be undone except by a Admin.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={() => props.handleFullDeleteClose()}>
        No
      </Button>
      <Button onClick={() => CompleteDelete()}>
        Yes
      </Button>
    </DialogActions>
  </Dialog>
  </>
  )
    }

    DeleteDialogFull.propTypes = {
        GoBack: PropTypes.func,
        SubmitForm: PropTypes.func,
        data:  PropTypes.object,
        larpList:  PropTypes.array,
        dropDownArray: PropTypes.array, 
        open: PropTypes.bool,
        handleFullDeleteClose: PropTypes.func,
        CompleteDelete: PropTypes.func,
        apiPath: PropTypes.object
      }