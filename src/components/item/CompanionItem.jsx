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
              <img className="companionitemPic" src={'data:image/png;base64,' + props.item.imagedata} alt={props.item.name} />
              <div className="attributesgridwrapper" >
                <div className="attributesgrid">
                  <div className="column1">
                    <div className="columnentry">Power</div>
                    <div className="columnentry">Athletics</div>
                    <div className="columnentry">Confidence</div>
                    <div className="columnentry">Brains</div>
                  </div>
                  <div className="column2">
                    <div className="columnentry">{props.item.fields.Power}</div>
                    <div className="columnentry">{props.item.fields.Athletics}</div>
                    <div className="columnentry">{props.item.fields.Confidence}</div>
                    <div className="columnentry">{props.item.fields.Brains}</div>
                  </div>
                  <div className="column1">
                    <div className="columnentry">H2H</div>
                    <div className="columnentry">Dodge</div>
                    <div className="columnentry">{props.item.fields.Fly !== null && props.item.fields.Fly !== undefined 
                   && props.item.fields.Fly !== '' ?
                     "Fly" : "Run"}</div>
                  </div>
                  <div className="column2">
                    <div className="columnentry">{props.item.fields.H2H}</div>
                    <div className="columnentry">{props.item.fields.Dodge}</div>
                    <div className="columnentry">{props.item.fields.Fly !== null && props.item.fields.Fly !== undefined
                    && props.item.fields.Fly !== ''  ?  
                    props.item.fields.Fly : props.item.fields.Run}</div>
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
              { props.item.fields.RESILIENCE != null || props.item.fields.GRADE != null
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
                    props.item.fields.GRADE != null && props.item.fields.GRADE != ''
                      ? <div className='grade'>
                        Grade: {props.item.fields.GRADE}
                      </div>
                      : <></>
                      //'\u00a0\u00a0'
                  }
                </span>
                : <div></div>
              }

                {props.item.fields.Description.split('\n').map((i,key) => {
            return <div className="companionitemDescription" key={key}><p>{i}</p></div>;
        })
            }

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
  item: PropTypes.object
}