import PropTypes from 'prop-types';
import SheetAbilities from '../sheetComponents/sheetAbilites';
import SheetBasicInfo from '../sheetComponents/sheetBasicInfo';
import SheetHeader from '../sheetComponents/sheetHeader';
import SheetTotals from '../sheetComponents/sheetTotals';
import ShipCrewPositons from '../sheetComponents/shipCrewPositions';
import './_shipitem.scss'

const ShipItem = props => {
    return (
      <>
        <div //</>ref={"charComponent"}
           className='sheet-printable' >
          <div className='sheet sheet1'>
            <div className='header-info'>
            <SheetHeader data={props.item}/>
            <SheetBasicInfo data={props.item} img={props.img}/>
            <hr className='basic-end'></hr>
            <hr className='stats-begin'></hr>
            <SheetTotals data={props.item.fields}/>
            <hr className='stats-begin'></hr>
            <hr className='basic-end'></hr>
            <SheetAbilities data={props.item.fields}/>
            </div>
          </div>
          <div className='sheet sheet2'>
            <div className='header-info'>
            <SheetHeader data={props.item}/>
            <ShipCrewPositons data={props.item.fields}/>
            <div className='shiprules'>
                <p>
             GENERAL SHIP RULES:</p><p>
1) The positions above are considered to be the most important positions for this ship. There can be more
crew aboard besides these, but only one character can fill a given officer position at a time. The same character
may not fill two positions at once. Write the crew member&apos;s name in after the position to designate
who is doing what job. If the canonical holder of a position is in play, write their name in.</p><p>
2) While aboard the ship, any crew member can always assist any other crew member with an action related
to their crew station. is includes crew members without named positions.</p><p>
3) Without substitute crew members, the ship is considered to have enough crew for absolute baseline operations
necessary to keep the ship functional. ese are faceless NPCs who operate in the background
and do not make tests of their own unless specified in one of the crew descriptions above.</p><p>
4) The captain can fill in any missing crew position until it is filled, but cannot do two things at once. If
the captain is flying the ship, they cannot also operate the weaponry, and vice versa.</p>
            </div>
            </div>
          </div>
        </div>
      </>
    )
}

export default ShipItem;

ShipItem.propTypes = {
    item: PropTypes.object,
      img: PropTypes.string
}