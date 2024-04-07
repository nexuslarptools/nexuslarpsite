import { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormLabel, TextField } from '@mui/material';
import { green } from '@mui/material/colors';

const ReviewNotesForm = props => {

    const [reviewMessage, setReviewMessage] = useState('');

    return (
        <div className="character-sheet-gm-notes">
        <div className='input-pair'>
          <FormLabel>
            Comments on reviewing this {props.type}:
          </FormLabel>
          <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {4898 - reviewMessage.length} Characters Remaining</Box>
          <TextField 
            variant="standard"
            type="input"
            inputProps={{maxLength: 4898}}
            id={'reviewMessage'}
            defaultValue={reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
          />
         <Button onClick={() => props.AddReview(reviewMessage)}>Add Review note</Button>
        </div>
      </div>
    )

}

export default ReviewNotesForm;

ReviewNotesForm.propTypes = {
  props: PropTypes.object,
  message: PropTypes.string,
  type: PropTypes.string,
  AddReview: PropTypes.func
}