import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import './_textbox.scss'

const TextBox = props => {

    const { onClose, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
  
    React.useEffect(() => {
      if (!open) {
        setValue(valueProp);
      }
    }, [valueProp, open]);

    const handleCancel = () => {
        onClose();
      };
    
      const handleOk = () => {
        onClose(value);
      };

      return (
      <Dialog disableRestoreFocus
    sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
    maxWidth="xs"
    open={open}
    {...other}>
      {/* <form onSubmit={handleOk}> */}
    <DialogTitle>Set {props.title} Filter</DialogTitle>
    <DialogContent dividers>
        <TextField  autoFocus variant="standard" type="input" className="form-control" 
          // id={props.index.toString()}
           defaultValue={value}
           onChange={(e) => setValue(e.target.value)}
           onKeyDown={(event) => {
                  if (event.key === 'Enter')
                     handleOk()
                  }}
           />
    </DialogContent>
    <DialogActions>
      <button className='button-cancel' onClick={handleCancel}>Cancel</button>
      {/*<Button autoFocus onClick={handleCancel}> Cancel </Button>*/}
      <button className='button-action' type='submit' onClick={handleOk}>Ok</button>
      {/* <Button onClick={handleOk}>Ok</Button> */}
    </DialogActions>
    {/* </form> */}
  </Dialog>
);

}
    export default TextBox;
    
    TextBox.propTypes = {
      onClose: PropTypes.func,
      value: PropTypes.string,
      title: PropTypes.string,
      open: PropTypes.bool
    }