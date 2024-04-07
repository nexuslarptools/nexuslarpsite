import React from 'react';
import CloseSharpIcon from '@mui/icons-material/CloseSharp';
import { Slide, Typography, IconButton, Toolbar, AppBar, Dialog } from '@mui/material';
import PropTypes from 'prop-types';

function Transition (props) {
  return <Slide direction="up" {...props} />
}

class ImgDialog extends React.Component {
  state = {
    open: false
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  }

  handleClose = () => {
    this.setState({ open: false });
  }

  render () {
    const { classes } = this.props;
    if (!this.props === undefined && !this.props === null) {
      return (
        <Dialog
          fullScreen
          open={!!this.props.img}
          onClose={this.props.onClose}
          TransitionComponent={Transition}
        >
          <AppBar>
            <Toolbar>
              <IconButton
                color="inherit"
                onClick={this.props.onClose}
                aria-label="Close">
                <CloseSharpIcon />
              </IconButton>
              <Typography
                variant="title"
                color="inherit">
                Cropped image
              </Typography>
            </Toolbar>
          </AppBar>
          <div className='Container'>
            <img src={this.props.img} alt="Cropped" className={classes.img} />
          </div>
        </Dialog>
      )
    } else {
      return ( <></> )
    }
  }
}

export default ImgDialog;

ImgDialog.propTypes = {
  img: PropTypes.string,
  classes: PropTypes.object,
  onClose: PropTypes.func
}