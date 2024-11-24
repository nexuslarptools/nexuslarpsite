import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Box, ClickAwayListener, TextField } from '@mui/material';

const FilterIcon = props => {
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
          <div ref={anchorRef}>
            <Box>
              <TextField id={id} value={filterState}
                variant="standard" onChange={e => updateFilter(e.target.value)} placeholder={'filter ' + props.label + ' list'} />
            </Box>
          </div>
        </ClickAwayListener>
      </div>
    </>
  )
}

export default FilterIcon;

FilterIcon.propTypes = {
  label: PropTypes.string,
  filterup: PropTypes.func,
  clearfilter: PropTypes.bool
}