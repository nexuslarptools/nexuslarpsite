import SpecialSkillsDisplayItem from '../specialskills/specialskillsdisplayitem';
import PropTypes from 'prop-types';
import Loading from '../loading/loading';
import './_companionitem.scss';

const CompanionItemBack = props => {
  if (!props || !props.item) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
      <>
        <div className = "companionItemBox">
        <span className="companionitemTitle">
              <p className="companionitemName">{props.item.name}</p>
              <p className="companionitemType">{props.item.fields.TYPE}</p>
        </span>
        <div className='itemSecondSideTextBox'>
          <div className="seriesItemText">
          {props.item.back.fields !== null && props.item.back.fields.Description !== undefined && props.item.back.fields.Description !== null ?
          props.item.back.fields.Description.split("\n").map((i,key) => {
            return <div className="item-description" key={key}>{i}</div>;
        }) :
        <div> </div>
              }
          </div>
        </div>
        {
                props.item.back.fields !== null && props.item.back.fields.Special_Skills != null 
                && props.item.back.fields.Special_Skills[0] != null
                  ? <div>
                    <hr className='divideline'></hr>
                    {props.item.back.fields.Special_Skills.map((skill) => 
                    skill.visible === true ?
                    <SpecialSkillsDisplayItem skill={skill} key={skill.Name + Math.random}/>
                    : <></>
                    )}
                  </div>
                  : <div> </div>
        }
        </div>
      </>
    )
  }
}

export default CompanionItemBack;

CompanionItemBack.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object
}