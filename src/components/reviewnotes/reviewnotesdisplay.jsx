import PropTypes from 'prop-types';
import { IconButton } from '@mui/material';
import EditSharpIcon from '@mui/icons-material/EditSharp';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import './_reviewnotesform.scss'
import usePutData from '../../utils/putdata';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import ReviewNotesForm from './reviewnotesform';

const ReviewNotesDisplay = props => {

  const [isEditing, setIsEditing] = useState(false)

  const queryClient = useQueryClient();

  const EditReview = async (e) =>
  {
    let body =
    {
      id: props.message.id,
      sheetid: props.message.sheetId,
      message:e
    }
    await setIsEditing(false);
    await oldMesageEditMutation.mutate(body)
    queryClient.invalidateQueries('messages_' + props.guid)

  }

  const RemoveReview = async () => {

    await oldMesageMutation.mutate()
    queryClient.invalidateQueries('messages_' + props.guid)
  }

  const oldMesageMutation = usePutData('/api/v1/ReviewMessages/'+props.type+'/Deactivate/' + props.message.id, ['messages_' + props.message.id]);
  const oldMesageEditMutation = usePutData('/api/v1/ReviewMessages/'+props.type+'/' + props.message.id, ['messages_' + props.message.id]);


    return (
       !isEditing ?
        <div className="character-sheet-review-notes">
        <div className='input-pair'>
              {props.message.message}
              {props.message.isEditable  ?
              <>
              <IconButton aria-label='edit' >
                <EditSharpIcon  onClick={() => setIsEditing(true)}/>
              </IconButton>
              <IconButton aria-label='delete' onClick={() => RemoveReview()} >
                <DeleteSharpIcon />
              </IconButton>
              </>  : <></>
              }
              <div>
                
              </div>
         Created by: {props.message.createdby}
        </div>
      </div>
      : <>
      <div>
          <ReviewNotesForm defaultReview={props.message.message}  AddReview={(e) => EditReview(e)} type={'Item'} />
          <button onClick={() => setIsEditing(false)}> Back </button>
      </div>
      </>
      
    )

}

export default ReviewNotesDisplay;

ReviewNotesDisplay.propTypes = {
  props: PropTypes.object,
  type: PropTypes.string,
  guid: PropTypes.string,
  message: PropTypes.object,
  formJSON: PropTypes.object,
  RemoveReview: PropTypes.func
}