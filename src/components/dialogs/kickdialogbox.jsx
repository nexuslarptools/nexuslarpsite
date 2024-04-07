import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material"
import { Button } from "reactstrap"
import PropTypes from 'prop-types';
import { useEffect, useState } from "react";
import usePutData from "../../utils/putdata";
import { useQueryClient } from "@tanstack/react-query";

export default function KickDialog(props) {

  const queryClient = useQueryClient();
  const[kickRow, setKickRow] = useState('')

   useEffect(() => {
      async function loadData () {
          await setKickRow(props.row) 
  }
loadData()
  }, [props.row, props.assettype])


  const CompleteKick = async () => {
      await currTagMutation.mutate()
      await queryClient.invalidateQueries(props.path.refreshName)
      props.handleKickClose()
    }

 const currTagMutation = usePutData('/api/v1/' + props.path.pathname + '/kick/' + kickRow.guid, [props.path.mutationName, props.path.refreshName])
   
 return (
        <>
          <Dialog
              onClose={() => props.handleKickClose()}
              aria-labelledby="customized-dialog-title"
              open={kickRow !== null}>
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Kick Back {kickRow.name}?
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={() => props.handleKickClose()}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500]
                }}>
              </IconButton>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Are you SURE you want to kick this sheet back to unapproved?
                  This cannot be undone except by a Admin.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={() => props.handleKickClose()}>No</Button>
                <Button onClick={() => CompleteKick()}>Yes</Button>
              </DialogActions>
            </Dialog>
          : <div></div>
        </>
    )
}

KickDialog.propTypes = {
    row: PropTypes.object,
    path: PropTypes.object,
    assettype: PropTypes.string,
    handleKickClose: PropTypes.func

}