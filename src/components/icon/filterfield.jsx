import PropTypes from 'prop-types';
import { Box, TextField } from '@mui/material';

const FilterField = props => {

  return (
    <>
      <div className='input-pair'>
          <div className='inputbox'
           >
            <Box>
              <TextField id={props.id} value={props.FilterInit}  
                variant="standard"
                disabled={true}
                  placeholder={props.label}/>
            </Box>
          </div>
      </div>
    </>
  )
}

export default FilterField;

FilterField.propTypes = {
  label: PropTypes.string,
  initalFilter: PropTypes.string,
  filterup: PropTypes.func,
  UnInitFiler: PropTypes.func,
  clearfilter: PropTypes.bool,
  FilterInit: PropTypes.bool,
  id: PropTypes.string
}