import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, ClickAwayListener, TextField } from '@mui/material';

const SearchIcon = props => {
  const [open, setOpen] = useState(false);
  const [openLock, setOpenLock] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [filterState, setFilerState] = useState('');

  useEffect(() => {
    if (props.clearfilter) {
      setFilerState('');
    }
  }, [props.clearfilter]);

  const anchorRef = useRef();

  useEffect(() => {
    setTimeout(() => setAnchorEl(anchorRef?.current), 1);
  }, [anchorRef]);

  useEffect(() => {
if (props.FilterInit) {
    setFilerState(props.initalFilter);
    props.UnInitFiler()
}
  }, [props.FilterInit]);

  const updateFilter = async (e) => {
    await setFilerState(e);
    props.filterup(e);
  }

  const handleClose = () => {
    if (!open) {
      setOpenLock(true);
    }
    if (open && !openLock) {
      setOpen((previousOpen) => !previousOpen);
      setOpenLock(true);
    } else {
      if (open) {
        setOpenLock(false);
      }
    }
  }

  const canBeOpen = open && Boolean(anchorEl);
  const id = canBeOpen ? 'transition-popper' : undefined;

  return (
    <>
      <div className='input-pair'>
        <ClickAwayListener onClickAway={handleClose} key={props.label}>
          <div className='inputbox' ref={anchorRef}>
            <Box>
              <TextField id={id} value={filterState}  
                variant="standard"
                 onChange={e => updateFilter(e.target.value)}
                 placeholder={props.label} />
            </Box>
          </div>
        </ClickAwayListener>
      </div>
    </>
  )
}

export default SearchIcon;

SearchIcon.propTypes = {
  label: PropTypes.string,
  initalFilter: PropTypes.string,
  filterup: PropTypes.func,
  UnInitFiler: PropTypes.func,
  clearfilter: PropTypes.bool,
  FilterInit: PropTypes.bool
}