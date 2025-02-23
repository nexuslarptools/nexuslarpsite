import { useState } from 'react';
import PropTypes from 'prop-types';
import './_reviewnotesform.scss';
import { Box, FormLabel, TextField } from '@mui/material';
import { green } from '@mui/material/colors';

const ReviewNotesForm = props => {

    const [reviewMessage, setReviewMessage] = useState('');

    return (
        <div className="character-sheet-review-notes">
        <div className='input-pair'>
          <FormLabel>
            Comments on Reviewing This {props.type}:
          </FormLabel>
          <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {4898 - reviewMessage.length} Characters Remaining</Box>
          <TextField 
            variant="standard"
            type="input"
            inputProps={{maxLength: 4898}}
            id={'reviewMessage'}
            defaultValue={props.defaultReview !== undefined && props.defaultReview !== null ? props.defaultReview : reviewMessage}
            onChange={(e) => setReviewMessage(e.target.value)}
          />
         <button className='button-save' onClick={() => props.AddReview(reviewMessage)}>{props.defaultReview !== undefined && props.defaultReview !== null ? 'Edit' : 'Add ' } Review Note</button>
        </div>
      </div>
    )

}

export default ReviewNotesForm;

ReviewNotesForm.propTypes = {
  props: PropTypes.object,
  defaultReview: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
  AddReview: PropTypes.func
}