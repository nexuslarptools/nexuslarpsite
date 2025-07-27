import SpecialSkillsDisplayItem from '../specialskills/specialskillsdisplayitem';
import PropTypes from 'prop-types';
import Loading from '../loading/loading';
import './_companionitem.scss';
import { formatText } from '../../utils/textParse';

const CompanionItem = props => {

let companionClassname = 'imgAndAttributesCompanion4'

if (props.item.fields.TYPE !== 'Mecha' &&
  props.item.fields.Power !== undefined && props.item.fields.Power !== null &&
props.item.fields.Power.toLowerCase() !== 'n/a' &&
  props.item.fields.Athletics !== undefined && props.item.fields.Athletics !== null &&
props.item.fields.Athletics.toLowerCase() !== 'n/a' &&
  props.item.fields.Brains !== undefined && props.item.fields.Brains !== null &&
props.item.fields.Brains.toLowerCase() !== 'n/a' &&
  props.item.fields.Confidence !== undefined && props.item.fields.Confidence !== null &&
props.item.fields.Confidence.toLowerCase() !== 'n/a' &&
  props.item.fields.Charisma !== undefined && props.item.fields.Charisma !== null &&
props.item.fields.Charisma.toLowerCase() !== 'n/a' 
) {
  companionClassname = 'imgAndAttributesCompanion5'
}




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
            <div className={companionClassname}>
            <div className="img">
              <img className="companionitemPic" src={props.img} alt={props.item.name} />
              <div className="attributesgridwrapper" >
                <div className="attributesgrid">
                  <div className="column1">
                    { props.item.fields.Power === undefined || props.item.fields.Power === null ||
                    props.item.fields.Power.toLowerCase() !== 'n/a' ?
                    <div className="columnentry">Power</div> : <></>}
                    { props.item.fields.Athletics === undefined || props.item.fields.Athletics === null ||
                    props.item.fields.Athletics.toLowerCase() !== 'n/a' ?
                    <div className="columnentry">Athletics</div> : <></>}
                    {props.item.fields.TYPE !== 'Mecha' && 
                    (props.item.fields.Brains === undefined || props.item.fields.Brains === null ||
                    props.item.fields.Brains.toLowerCase() !== 'n/a') ?
                    <div className="columnentry">Brains</div> : <></>}
                    {props.item.fields.TYPE !== 'Mecha' && 
                      (props.item.fields.Confidence === undefined || props.item.fields.Confidence === null ||
                        props.item.fields.Confidence.toLowerCase()) !== 'n/a' ?
                    <div className="columnentry">Confidence</div> : <></>}
                    {props.item.fields.TYPE !== 'Mecha' && 
                     (props.item.fields.Charisma === undefined || props.item.fields.Charisma === null || 
                      props.item.fields.Charisma.toLowerCase()) !== 'n/a' ?
                    <div className="columnentry">Charisma</div> : <></> }
                  </div>
                  <div className="column2">

                    {props.item.fields.Power === null 
                    || props.item.fields.Power === undefined || props.item.fields.Power === '' ? 
                    <div className="columnentry">{'0'}</div>
                    : 
                    props.item.fields.Power.toLowerCase() === 'n/a' ? <></> :
                    <div className="columnentry">  {props.item.fields.Power} </div>}

                    {props.item.fields.Athletics === null 
                    || props.item.fields.Athletics === undefined || props.item.fields.Athletics === '' ? 
                    <div className="columnentry">{'0'}</div>: 
                     props.item.fields.Athletics.toLowerCase() === 'n/a' ? <></> : <div className="columnentry"> 
                     {props.item.fields.Athletics}</div>}

                    { props.item.fields.TYPE !== 'Mecha' ? 
                     props.item.fields.Brains === null 
                    || props.item.fields.Brains === undefined || props.item.fields.Brains === '' ? 
                    <div className="columnentry">{'0'}</div>: 
                     props.item.fields.Brains.toLowerCase() === 'n/a' ? <></> : <div className="columnentry"> 
                     {props.item.fields.Brains}</div>: <></>}

                    { props.item.fields.TYPE !== 'Mecha' ? 
                      props.item.fields.Confidence === null 
                    || props.item.fields.Confidence === undefined 
                    || props.item.fields.Confidence === '' ? 
                    <div className="columnentry">{'0'}</div>:
                    props.item.fields.Confidence.toLowerCase() === 'n/a' ? <></> : <div className="columnentry"> 
                      {props.item.fields.Confidence}</div> : <></>}

                    { props.item.fields.TYPE !== 'Mecha' ? 
                      props.item.fields.Charisma === null 
                    || props.item.fields.Charisma === undefined 
                    || props.item.fields.Charisma === '' ? 
                    <div className="columnentry">{'0'}</div>:
                    props.item.fields.Charisma.toLowerCase() === 'n/a' ? <></> : <div className="columnentry"> 
                      {props.item.fields.Charisma}</div> : <></>}
                      

                  </div>
                  <div className="column1">
                    { (props.item.fields.H2H === undefined || props.item.fields.H2H === null ||  
                    props.item.fields.H2H.toLowerCase()) !== 'n/a' ?
                    <div className="columnentry">H2H</div> : <></> }
                    {  (props.item.fields.Dodge === undefined || props.item.fields.Dodge === null ||  
                    props.item.fields.Dodge.toLowerCase()) !== 'n/a' ?
                    <div className="columnentry">Dodge</div> : <></> }
                      {props.item.fields.Move !== null && props.item.fields.Move !== undefined 
                   && props.item.fields.Move !== '' ? <div className="columnentry">{"Move"}</div> :
                     props.item.fields.Fly !== null && props.item.fields.Fly !== undefined 
                   && props.item.fields.Fly !== '' ?
                    <div className="columnentry">{"Fly"}</div> :
                    (props.item.fields.Run === undefined || props.item.fields.Run === null || 
                    props.item.fields.Run.toLowerCase() !== 'n/a') ?
                    <div className="columnentry">{"Run"}</div> : <></>
                      }
                  {props.item.fields.Jump === null 
                    || props.item.fields.Jump === undefined 
                    || props.item.fields.Jump === '' || props.item.fields.Jump.toLowerCase() === 'n/a'
                    ||
                    (props.item.fields.Move !== null 
                      && props.item.fields.Move !== undefined
                      && props.item.fields.Move !== '' && props.item.fields.Move.toLowerCase() !== 'n/a'
                    )  ? <></> :
                     <div className="columnentry">Jump</div>
                                         }
                  </div>
                  <div className="column2">
                     {  props.item.fields.H2H === null 
                    || props.item.fields.H2H === undefined 
                    || props.item.fields.H2H === '' ? 
                    <div className="columnentry">{'0'}</div>:
                    props.item.fields.H2H.toLowerCase() === 'n/a' ? <></> : <div className="columnentry"> 
                      {props.item.fields.H2H}</div>}

                   {  props.item.fields.Dodge === null 
                    || props.item.fields.Dodge === undefined 
                    || props.item.fields.Dodge === '' ? 
                    <div className="columnentry">{'0'}</div>:
                    props.item.fields.Dodge.toLowerCase() === 'n/a' ? <></> : <div className="columnentry"> 
                      {props.item.fields.Dodge}</div>}

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
              { (props.item.fields.RESILIENCE != null && props.item.fields.RESILIENCE !== ""
              )
               || (props.item.fields.Grade != null && props.item.fields.Grade !== ""
                )
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
              {props.item.fields.Description !== undefined && props.item.fields.Description !== null &&
              props.item.fields.Description !== '' ?
              props.item.fields.Description.split('\n').map((i,key) => {
            return <div className="companionitemDescription" key={key}><p>{
              formatText(i)
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