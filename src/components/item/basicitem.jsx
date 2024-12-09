import SpecialSkillsDisplay from '../specialskills/specialskillsdisplay';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import './_item.scss'

const BasicItem = props => {
const specialskillsallowed = [
  "Mecha",
  "Vehicle",
  "Companion",
  "Pokemon"
];

  if (!props || !props.item) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
    <>
      <div className="seriesItemBox">
        <div className="seriesItem">
          <div className='itemTitleBox'>
            { props.item.name.length < 26 ?
              <h3 className='itemName'>{props.item.name}</h3> :
              <h3 className='itemNameSM'>{props.item.name}</h3> 
            }
            {/* <h3 className="itemName">{props.item.name}</h3> */}
            <h3 className="itemType">{props.item.fields.TYPE}</h3>
          </div>
          <div className='itemPicBox'>
                <img className="itemPic" src={props.img} alt={''} />
          </div>
          <div className='itemTextBox'>
            <div className="seriesItemText">
              <div className="item-stats">
                {
                  props.item.fields.Power != null && props.item.fields.Power != ''
                    ? <>{'  '} Power: {props.item.fields.Power} {'  '}</>
                    : <></>
                }
                {
                  props.item.fields.Athletics != null && props.item.fields.Athletics != ''
                    ? <>Athletics: {props.item.fields.Athletics}</>
                    : <></>
                }
                {
                  props.item.fields.Confidence != null && props.item.fields.Confidence != ''
                    ? <>Confidence: {props.item.fields.Confidence}</>
                    : <></>
                }
                {
                  props.item.fields.Brains != null && props.item.fields.Brains != ''
                    ? <>Brains: {props.item.fields.Brains}</>
                    : <></>
                }
                {
                  props.item.fields.H2H != null && props.item.fields.H2H != ''
                  ? <>H2H: {props.item.fields.H2H}</>
                  : <></>
                }
                {
                  props.item.fields.Dodge != null && props.item.fields.Dodge != ''
                    ? <>Dodge: {props.item.fields.Dodge}</>
                    : <></>
                }
                {
                  props.item.fields.Move != null && props.item.fields.Move != ''
                    ? <>Move: {props.item.fields.Move}</>
                    : <></>
                }
                {
                  props.item.fields.HS != null && props.item.fields.HS != ''
                    ? <>{'  '} HS: {props.item.fields.HS} {'  '}</>
                    : <></>
                }
                {
                  props.item.fields.Cost != null && props.item.fields.Cost !== ''
                    ? <> {'  '} Value: {props.item.fields.Cost} {'  '} </>
                    : <></>
                }
                                {
                  props.item.fields.Value != null && props.item.fields.Value != ''
                    ? <>{'  '} Value: {props.item.fields.Value} {'  '}</>
                    : <></>
                }
                {
                  props.item.fields.RUN != null && props.item.fields.RUN != ''
                    ? <>Run: {props.item.fields.RUN}</>
                    : <></>
                }
                {
                  props.item.fields.GRADE != null && props.item.fields.GRADE != ''
                    ? <>Grade: {props.item.fields.GRADE}</>
                    : <></>
                }
                {
                  props.item.fields.EnergyCost != null && props.item.fields.EnergyCost != ''
                    ? <>{'  '} Energy Cost: {props.item.fields.EnergyCost} {'  '} </>
                    : <></>
                }
                {
                props.item.fields.INTEGRITY != null && props.item.fields.INTEGRITY !== ''
                  ? <> {'  '} Integrity: {props.item.fields.INTEGRITY} {'  '} </>
                  : <></>
                }
                {
                props.item.fields.RESILIENCE != null && props.item.fields.RESILIENCE !== ''
                  ? <>Resilience: {props.item.fields.RESILIENCE}</>
                  : <></>
                }
              </div>
              <div className='item-description'>
              {props.item.fields.Description !== undefined && props.item.fields.Description !== null ?
              props.item.fields.Description.split('\n').map((i,key) => {
            return <div className="item-Description" key={key}><p>{
              i.split('--').map((s, j) => j % 2 !== 0 ? <><u> {s} </u></> : (' ' + s ))
              }</p></div>;
        })
            : <></>}
            </div>
                {
                  props.item.fields.Special_Skills != null && specialskillsallowed.some(val => val === props.item.fields.TYPE)
                    ? <div>
                        <hr className='divideline'></hr>
                        {props.item.fields.Special_Skills.map((skill) => 
                        skill.visible === true ?
                        <SpecialSkillsDisplay skill={skill} key={Math.random} /> 
                      :<></>)}
                      </div>
                    : <></>
                }
                {
                  props.item.fields.Magic != null && props.item.fields.Magic != ''
                  && !props.item.isdoubleside
                    ? <div>Magic: {props.item.fields.Magic}</div>
                    : <></>
                }
              {
                  props.item.fields.Uses != null && props.item.fields.Uses > 0
                  ? <div className='item-uses-container'>  
                      <div className ='item-uses-text'> Uses:
                      { Array.apply(null, { length: props.item.fields.Uses }).map((e, i) => (
                         <span className="item-uses" key={i}>○</span>
                        ))
                      }
                      </div>
                    </div>
                  : <></>
                }
            </div>
          </div>
        </div>
      </div>
    </>
    )
  }
}

export default BasicItem;

BasicItem.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  img: PropTypes.string
}