import PropTypes from 'prop-types';
import './_specialskillsdisplay.scss';

const SpecialSkillsDisplay = props => {
  return (
    <>
      <div className='widthwrapper'>
        <span className='titlespan'> {
          props.skill.Name !== undefined && props.skill.Name !== null
            ? <div className='skillName'>
                {props.skill.Name}:
            </div>
            : <div> </div>
          }
          {
            props.skill.Rank !== undefined && props.skill.Rank !== null && props.skill.Rank.trim() !== ''
              ? <div className='rank'>
                {props.skill.Rank}
              </div>
              : <div> </div>
          }
          {
            props.skill.Cost !== undefined && props.skill.Cost !== null && props.skill.Cost.trim() !== ''
              ? <div className='cost'>
                Cost: {props.skill.Cost}
              </div>
              : <div> </div>
          }
        </span>
        {
          props.skill.Description !== undefined && props.skill.Description !== null
            ? <div className='skilldesc'>
              {props.skill.Description}
            </div>
            : <div> </div>
        }
      </div>
    </>
  )
}

export default SpecialSkillsDisplay;

SpecialSkillsDisplay.propTypes = {
  skill: PropTypes.object
}