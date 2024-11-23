import PropTypes from 'prop-types';

const SpecialSkillsDisplayCharacter = props => {
  return (
    <>
      <span className='skill-header'>
        {
          props.skill.Name !== undefined && props.skill.Name !== null
            ? <div className='name' key={"name"+props.skill.Name + Math.random}>[ {props.skill.Name} ]</div>
            : null
        }
        {
          props.skill.Rank !== undefined && props.skill.Rank !== null && props.skill.Rank.trim() !== ''
            ? <div className='rank' key={"rank"+props.skill.Name + Math.random}>Skill: {props.skill.Rank}</div>
            : null
        }
        {
          props.skill.Cost !== undefined && props.skill.Cost !== null && props.skill.Cost.trim() !== ''
            ? <div className='cost' key={"cost"+props.skill.Name + Math.random}>Cost: {props.skill.Cost}</div>
            : null
        }
      </span>
      {
        props.skill.Description !== undefined && props.skill.Description !== null
          ? <div className='skill-text'>
            {props.skill.Description.split('\n').map((i,key) => {
            return <div className="skill-description" key={key}><p>{
              i.split('--').map((s, j) => j % 2 !== 0 ? <><u> {s} </u></> : (' ' + s ))
              }</p></div>;
        })
            }
          </div>
          : null
      }
    </>
  )
}

export default SpecialSkillsDisplayCharacter;

SpecialSkillsDisplayCharacter.propTypes = {
  skill: PropTypes.object
}