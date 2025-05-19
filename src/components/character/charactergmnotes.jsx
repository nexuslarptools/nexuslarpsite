import PropTypes from 'prop-types';

const CharacterGMNotes = props => {

    if (props.character.gmnotes.length > 0) {
    return (
                       
        <div className='sheet sheet3'>
            <div className='gm-notes'>
                <div className='gm-notes-heading'>GM Notes for {props.character.name}</div>
                <div className='gm-notes-text'>
                 {props.character.gmnotes.split('\n').map(str => <p key={Math.random}>{str}</p>)}
                </div>
            </div>
        </div>
                    
    )
}

return null
}
export default CharacterGMNotes;

CharacterGMNotes.propTypes = {
  character: PropTypes.object
}