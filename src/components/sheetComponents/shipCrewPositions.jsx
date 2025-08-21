import PropTypes from "prop-types";
import CrewPositionDisplayShip from "./crewPositionDisplayShip";

const ShipCrewPositons = props => {

    return (
      <>
            <div className='shipAbilites'>
              Ship Crew Positions 
              <hr className='seperator'/>
                              {
                                props.data.CrewPositions != null && props.data.CrewPositions[0] != null
                                  ? <>
                                    {props.data.CrewPositions.map((position, index) => (
                                      <div key={index + Math.random} className="skill">
                                        <CrewPositionDisplayShip position={position} />
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

export default ShipCrewPositons;

ShipCrewPositons.propTypes = {
    data: PropTypes.object
}