import PropTypes from 'prop-types';
import PopupItem from '../item/popupitem';
import { useState, useEffect, useRef } from 'react';
import { Popper, ClickAwayListener, Fade, Box, Typography } from '@mui/material';


const ItemPopover = props => {
  const [open, setOpen] = useState(false);
  const [popoverState, setPopoverState] = useState(null);
  const anchorRef = useRef();

  useEffect(() => {
    if (props.reopen) {
      setOpen(true)
    }
  }, [props.reopen]);

  const handlePopoverOpen = (e) => {
    setOpen((prev) => !prev);
    setPopoverState(e);
  }

  const handlePopoverClose = () => {
    setOpen(false);
    setPopoverState(null);
  }

  return (
    <>
      <ClickAwayListener onClickAway={handlePopoverClose} key={props.guid}>
        <Typography
          onClick={(e) => handlePopoverOpen(props.guid) }>
          {props.name}
        </Typography>
      </ClickAwayListener>
      <div ref={anchorRef}>
        <Popper className='itemPopper' onClose={() => handlePopoverClose} open={open} transition anchorEl={anchorRef.current}>
          {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
          <Box sx={{ border: 1, p: 1, bgcolor: 'white' }}>
            <PopupItem guid={props.guid} />
          </Box>
          </Fade>
          )}
        </Popper>
      </div>
    </>
  )
}
export default ItemPopover;

ItemPopover.propTypes = {
  ReturnItem: PropTypes.func,
  ListItemClick: PropTypes.func,
  guid: PropTypes.string,
  path: PropTypes.string,
  name: PropTypes.string,
  reopen: PropTypes.bool
}