import PropTypes from 'prop-types';
import SpecialSkillsDisplayCharacter from '../specialskills/specialskillsdisplaycharacter';
import './_sheetAbilities.scss';

const SheetAbilities = props => {

    return (
      <>
            <div className='shipAbilites'>
              Ship Abilities 
              <hr className='seperator'/>
                              {
                                props.data.Special_Skills != null && props.data.Special_Skills[0] != null
                                  ? <>
                                    {props.data.Special_Skills.map((skill, index) => (
                                      <div key={index + Math.random} className="skill">
                                        <SpecialSkillsDisplayCharacter skill={skill} />
                                      </div>
                                    ))}
                                  </>
                                  : <div>
                                  </div>
                              }
            </div>

      </>
    )
}

export default SheetAbilities;

SheetAbilities.propTypes = {
    data: PropTypes.object
}