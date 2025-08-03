import PropTypes from 'prop-types';
import { formatText } from '../../utils/textParse';

const CrewPositionDisplayShip = props => {
  return (
    <>
      <span className='skill-header'>
        {
          props.position.Position !== undefined && props.position.Position !== null
            ? <div className='name' key={"name"+props.position.Position + Math.random}>[ {props.position.Position} ]</div>
            : null
        }
        {
          props.position.DefaultCrew !== undefined && props.position.DefaultCrew !== null 
          && props.position.DefaultCrew.trim() !== ''
            ? <div className='rank' key={"rank"+props.position.DefaultCrew + Math.random}>Default: {props.position.DefaultCrew}</div>
            : <div className='rank' key={"rank"+props.position.DefaultCrew + Math.random}>___________________________________________________________________ </div>
        }
      </span>
      {
        props.position.Details !== undefined && props.position.Details !== null
          ? <div className='skill-text'>
            {props.position.Details.split('\n').map((i,key) => {
            return <div className="skill-description" key={key}><p>{
              formatText(i)
              }</p></div>;
        })
            }
          </div>
          : null
      }
    </>
  )
}

export default CrewPositionDisplayShip;

CrewPositionDisplayShip.propTypes = {
  position: PropTypes.object
}