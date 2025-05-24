import SpecialSkillsDisplayItem from '../specialskills/specialskillsdisplayitem';
import PropTypes from 'prop-types';
import Loading from '../loading/loading';
import './_companionitem.scss';

const CompanionItem = props => {
  if (!props || !props.item) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
      <>
        <div className = "companionItemBox">
          <div className="companionItem">
            <span className="companionitemTitle">
              <p className="companionitemName">{props.item.name}</p>
              <p className="companionitemType">{props.item.fields.TYPE}</p>
            </span>
            <div className="img">
              <img className="companionitemPic" src={props.img} alt={props.item.name} />
              <div className="attributesgridwrapper" >
                <div className="attributesgrid">
                  <div className="column1">
                    <div className="columnentry">Power</div>
                    <div className="columnentry">Athletics</div>
                   {props.item.fields.TYPE !== 'Mecha' ? <div className="columnentry">Brains</div> :<></> }
                   {props.item.fields.TYPE !== 'Mecha' ? <div className="columnentry">Confidence</div> : <></> }
                   {props.item.fields.TYPE !== 'Mecha' ? <div className="columnentry">Charisma</div> : <></> }
                  </div>
                  <div className="column2">
                  <div className="columnentry"> {props.item.fields.Power === null 
                    || props.item.fields.Power === undefined || props.item.fields.Power === '' ? '0': props.item.fields.Power}</div>
                  <div className="columnentry"> {props.item.fields.Athletics === null 
                    || props.item.fields.Athletics === undefined || props.item.fields.Athletics === '' ? '0': props.item.fields.Athletics}</div>
                    { props.item.fields.TYPE !== 'Mecha' ? <div className="columnentry">{ props.item.fields.Brains === null 
                    || props.item.fields.Brains === undefined || props.item.fields.Brains === '' ? '0': props.item.fields.Brains}</div>: <></>}
                    { props.item.fields.TYPE !== 'Mecha' ? <div className="columnentry">{ props.item.fields.Confidence === null 
                    || props.item.fields.Confidence === undefined 
                    || props.item.fields.Confidence === '' ? '0': props.item.fields.Confidence}</div> : <></>}
                    { props.item.fields.TYPE !== 'Mecha' ? <div className="columnentry">{props.item.fields.Charisma === null 
                    || props.item.fields.Charisma === undefined 
                    || props.item.fields.Charisma === '' ? '0': props.item.fields.Charisma}</div> : <></>}
                  </div>
                  <div className="column1">
                    <div className="columnentry">H2H</div>
                    <div className="columnentry">Dodge</div>
                    <div className="columnentry">
                      {props.item.fields.Move !== null && props.item.fields.Move !== undefined 
                   && props.item.fields.Move !== '' ? "Move" :
                     props.item.fields.Fly !== null && props.item.fields.Fly !== undefined 
                   && props.item.fields.Fly !== '' ?
                     "Fly" :
                      "Run"}</div>
                  {props.item.fields.Jump === null 
                    || props.item.fields.Jump === undefined 
                    || props.item.fields.Jump === ''
                    ||
                    (props.item.fields.Move !== null 
                      && props.item.fields.Move !== undefined
                      && props.item.fields.Move !== ''
                    )  ? <></> :
                     <div className="columnentry">Jump</div>
                                         }
                  </div>
                  <div className="column2">
                    <div className="columnentry"> {props.item.fields.H2H === null 
                    || props.item.fields.H2H === undefined || props.item.fields.H2H === '' ? '0': props.item.fields.H2H}</div>
                    <div className="columnentry"> {props.item.fields.Dodge === null 
                    || props.item.fields.Dodge === undefined || props.item.fields.Dodge === '' ? '0': props.item.fields.Dodge}</div>
                    <div className="columnentry">
                    {props.item.fields.Move !== null && props.item.fields.Move !== undefined 
                    && props.item.fields.Move !== '' ? props.item.fields.Move :
                    props.item.fields.Fly !== null && props.item.fields.Fly !== undefined
                    && props.item.fields.Fly !== ''  ?  
                    props.item.fields.Fly : props.item.fields.Run === undefined || props.item.fields.Run === null || 
                    props.item.fields.Run === '' ? '0' : props.item.fields.Run }
                    </div>
                    {props.item.fields.Jump === null 
                    || props.item.fields.Jump === undefined
                    || props.item.fields.Jump === '' ||
                    (props.item.fields.Move !== null 
                      && props.item.fields.Move !== undefined
                      && props.item.fields.Move !== ''
                    )  ? <></> :
                    <div className="columnentry"> {props.item.fields.Jump === null 
                    || props.item.fields.Jump === undefined || props.item.fields.Jump === '' ? '0': props.item.fields.Jump}</div>
                     }
                  </div>
                </div>
              </div>
            </div>
            <div className="companionItemText" >
              <div className="bodyandenergywrap" >
                {
                  props.item.fields.Body != null && props.item.fields.Body > 0
                    ? <div className='bodywrap'>
                      Body: { Array.apply(null, { length: props.item.fields.Body }).map((e, i) => (
                        <span className="busterCards2" key={i}>○</span>
                      ))}
                    </div>
                    : <></>
                }
                {
                  props.item.fields.Energy != null && props.item.fields.Energy > 0
                    ? <div className='energywrap'>
                      Energy: { Array.apply(null, { length: props.item.fields.Energy }).map((e, i) => (
                        <span className="busterCards2" key={i}>○</span>
                      ))}
                    </div>
                    : <></>
                }
              </div>
              { props.item.fields.RESILIENCE != null || props.item.fields.Grade != null
                ? <span className = "itemStats">
                  {
                    props.item.fields.RESILIENCE != null && props.item.fields.RESILIENCE != ''
                      ? <div className='resilience' >
                        Resilience: {props.item.fields.RESILIENCE}
                      </div>
                      : <></>
                      //'\u00a0\u00a0'
                  }
                  {
                    props.item.fields.Grade != null && props.item.fields.Grade != ''
                      ? <div className='grade'>
                        Grade: {props.item.fields.Grade}
                      </div>
                      : <></>
                      //'\u00a0\u00a0'
                  }
                </span>
                : <div></div>
              }
              {props.item.fields.Description !== undefined && props.item.fields.Description !== null ?
              props.item.fields.Description.split('\n').map((i,key) => {
            return <div className="companionitemDescription" key={key}><p>{
              i.split('--').map((s, j) => j % 2 !== 0 ? <><u> {s} </u></> : (' ' + s ))
              }</p></div>;
        })
            : <></>}

              {
                props.item.fields.Special_Skills != null && props.item.fields.Special_Skills[0] != null
                  ? <div>
                    <hr className='divideline'></hr>
                    {props.item.fields.Special_Skills.map((skill) => 
                    skill.visible === true ?
                    <SpecialSkillsDisplayItem skill={skill} key={skill.Name + Math.random}/>
                    : <></>
                    )}
                  </div>
                  : <div> </div>
              }
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default CompanionItem;

CompanionItem.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  img: PropTypes.string
}