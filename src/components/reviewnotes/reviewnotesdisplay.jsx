import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';

const ReviewNotesDisplay = props => {

    return (
        <div className="character-sheet-gm-notes">
        <div className='input-pair'>
          <TextField 
            variant="standard"
            type="input"
            disabled={true}
            id={'reviewMessage'}
            defaultValue={
                props.message.message
            }
            sx={{
                backgroundColor: '#000000',
              }}
          /> <Button onClick={() => props.RemoveReview(props.message.id)}>Remove Review</Button>
         Created by: {props.message.createdby}
        </div>
      </div>
    )

}

export default ReviewNotesDisplay;

ReviewNotesDisplay.propTypes = {
  props: PropTypes.object,
  message: PropTypes.object,
  formJSON: PropTypes.object,
  RemoveReview: PropTypes.func
}