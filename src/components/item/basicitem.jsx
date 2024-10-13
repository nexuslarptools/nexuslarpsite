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
            <h3 className="itemName">{props.item.name}</h3>
            <h3 className="itemType">{props.item.fields.TYPE}</h3>
          </div>
          <div className='itemPicBox'>
                <img className="itemPic" src={'data:image/png;base64,' + props.item.imagedata} alt={''} />
          </div>
          <div className='itemTextBox'>
            <div className="seriesItemText">
              <div className="item-stats">
                {
                  props.item.fields.Power != null && props.item.fields.Power != ''
                    ? <div>Power: {props.item.fields.Power}</div>
                    : <></>
                }
                {
                  props.item.fields.Athletics != null && props.item.fields.Athletics != ''
                    ? <div>Athletics: {props.item.fields.Athletics}</div>
                    : <></>
                }
                {
                  props.item.fields.Confidence != null && props.item.fields.Confidence != ''
                    ? <div>Confidence: {props.item.fields.Confidence}</div>
                    : <></>
                }
                {
                  props.item.fields.Brains != null && props.item.fields.Brains != ''
                    ? <div>Brains: {props.item.fields.Brains}</div>
                    : <></>
                }
                {
                  props.item.fields.H2H != null && props.item.fields.H2H != ''
                  ? <div>H2H: {props.item.fields.H2H}</div>
                  : <></>
                }
                {
                  props.item.fields.Dodge != null && props.item.fields.Dodge != ''
                    ? <div>Dodge: {props.item.fields.Dodge}</div>
                    : <></>
                }
                {
                  props.item.fields.Move != null && props.item.fields.Move != ''
                    ? <div>Move: {props.item.fields.Move}</div>
                    : <></>
                }
                {
                  props.item.fields.HS != null && props.item.fields.HS != ''
                    ? <div>HS: {props.item.fields.HS}</div>
                    : <></>
                }
                {
                  props.item.fields.Cost != null && props.item.fields.Cost !== ''
                    ? <div>Value: {props.item.fields.Cost}</div>
                    : <></>
                }
                                {
                  props.item.fields.Value != null && props.item.fields.Value != ''
                    ? <div>Value: {props.item.fields.Value}</div>
                    : <></>
                }
                {
                  props.item.fields.RUN != null && props.item.fields.RUN != ''
                    ? <div>Run: {props.item.fields.RUN}</div>
                    : <></>
                }
                {
                  props.item.fields.GRADE != null && props.item.fields.GRADE != ''
                    ? <div>Grade: {props.item.fields.GRADE}</div>
                    : <></>
                }
                {
                  props.item.fields.EnergyCost != null && props.item.fields.EnergyCost != ''
                    ? <div>Energy Cost: {props.item.fields.EnergyCost}</div>
                    : <></>
                }
                {
                props.item.fields.INTEGRITY != null && props.item.fields.INTEGRITY !== ''
                  ? <div className='itemINTEGRITY'>Integrity: {props.item.fields.INTEGRITY}</div>
                  : <></>
                }
                {
                props.item.fields.RESILIENCE != null && props.item.fields.RESILIENCE !== ''
                  ? <div className='itemRESILIENCE'>Resilience: {props.item.fields.RESILIENCE}</div>
                  : <></>
                }
              </div>
              <div className="item-description">{props.item.fields.Description}
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
              </div>
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
  item: PropTypes.object
}