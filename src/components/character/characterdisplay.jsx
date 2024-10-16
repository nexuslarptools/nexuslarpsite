import CharacterSheetHeading from '../charactersections/charactersheetheading';
import CharacterSheetTable from '../charactersections/charactersheettable';
import Item from '../item/item';
import SpecialSkillsDisplayCharacter from '../specialskills/specialskillsdisplaycharacter';
import ItemPalette from '../itempalette/itempalette';
import PropTypes from 'prop-types';
import './_characterdisplay.scss';


const CharacterDisplay = props => {

    return(
<div  className='character-sheet-printable' >
<div className='sheet sheet1'>
  <div className='header-info'>
    <div className='sheet-name-series'>
      <div className='sheetName'>{props.character.name}</div>
      <div className='seriesName'>{props.character.seriesTitle}</div>
    </div>
    <CharacterSheetHeading img={props.imageData.image1}  other={props.JSONData.formData[0]} attributes={props.JSONData.formData[1]} />
  </div>
  <div className='allSkills-and-sheet-item-container'>
    <div className='standard-skills'>
      <div className='skills-table'><CharacterSheetTable list={props.JSONData.formData[2]} tableClasses={'skills1 sheet-table'} tableName={'Standard Skills'}  /></div>
    </div>
    <div className='combat-skills-and-sheet-item-container'>
      <div className='skills-table'><CharacterSheetTable list={props.JSONData.formData[3]} tableClasses={'combat sheet-table'} tableName={'Combat Skills'}  /></div>
      <div className='sheet-item-container'>
        <div className='sheet-item'><Item item={props.character.sheet_Item}></Item></div>
      </div>
    </div>

    <div className='body-energy-res-stats-container'>
      <div className='body-energy-res-stats'>
        <span className='statsSpan'>
          <div className='stat-name'>Body:</div>
          <div className='symbols-row'>
            { Array.apply(null, { length: props.character.fields.Body }).map((e, i) => (
              <span className="body" key={i} alt="body"></span>
            ))}
          </div>
        </span>
        <span className='statsSpan'>
          <div className='stat-name'>Energy:</div>
          <div className='symbols-row'>
            { Array.apply(null, { length: props.character.fields.Energy }).map((e, i) => (
              <span className="energy" key={i} alt="energy"></span>
            ))}
          </div>
        </span>
        <span className='statsSpan'>
          <div className='stat-name'>Resilience:</div>
          <div className='symbols-row'>
            { Array.apply(null, { length: props.character.fields.Resilience }).map((e, i) => (
                <span className="shield" key={i} alt="shield"></span>
            ))}
          </div>
        </span>
      </div>

      { props.imageData.image2 !== undefined && props.imageData.image2 !== null && props.imageData.image2 !== '' && props.imageData.image2 !== 'data:image/png;base64,null' ?
        <div className='imgContainer full-body-image'>
          <img src={props.imageData.image2} className='charFullBodyImg' alt="character full body shot"></img>
        </div> 
        : <></> 
      }
    </div>
    
  </div>
  <div className="starting-items">
    <div className='starting-items-header'>Starting Items: <span className='starting-items-amount'>({props.character.starting_Items !== undefined ? props.character.starting_Items.length : 0})</span></div>
    <div className='starting-items-list'>
      {props.itemList.map((item, i) => 
        i + 1 === props.itemList.length
          ? item.itemName
          :  item.total > 1
          ?  item.itemName + ' (' + item.total + '),  '
            : item.itemName + ',  '
      )}
    </div>
  </div>
</div>
{ 
  !props.specialSkillSpace.isactive ?
    <div className='sheet sheet2'>
      <div className='header-info'>
        <div className='sheet-name-series'>
          <div className='sheetName'>{props.character.name}</div>
          <div className='seriesName'>{props.character.seriesTitle}</div>
        </div>
      </div>
      <div className='special-skills'>
        <div className='special-skills-header'>Special Skills</div>
        {
          props.character.fields.Special_Skills != null && props.character.fields.Special_Skills[0] != null
            ? <>
              {props.character.fields.Special_Skills.map((skill, index) => (
                <div key={index + Math.random} className="skill">
                  <SpecialSkillsDisplayCharacter skill={skill} />
                </div>
              ))}
            </>
            : <div>
            </div>
        }
      </div>
    </div>
  : <>
      <div className='sheet sheet2'>
      <div className='header-info'>
        <div className='sheet-name-series'>
          <div className='sheetName'>{props.character.name}</div>
          <div className='seriesName'>{props.character.seriesTitle}</div>
        </div>
      </div>
      <div className='special-skills'>
        <div className='special-skills-header'>Special Skills Page 1</div>
        {
          props.specialSkillSpace.page1 != null && props.specialSkillSpace.page1.length > 0 && props.specialSkillSpace.page1 != null
            ? <>
              {props.specialSkillSpace.page1.map((skill, index) => (
                <div key={index + Math.random} className="skill">
                  <SpecialSkillsDisplayCharacter skill={skill} />
                </div>
              ))}
            </>
            : <div>
            </div>
        }
      </div>
      </div>
      <div className='sheet sheet2'>
         <div className='header-info'>
           <div className='sheet-name-series'>
             <div className='sheetName'>{props.character.name}</div>
             <div className='seriesName'>{props.character.seriesTitle}</div>
           </div>
         </div>
         <div className='special-skills'>
           <div className='special-skills-header'>Special Skills Page 2</div>
           {
             props.specialSkillSpace.page2 != null && props.specialSkillSpace.page2.length > 0 && props.specialSkillSpace.page2[0] != null
               ? <>
                 {props.specialSkillSpace.page2.map((skill, index) => (
                   <div key={index + Math.random} className="skill">
                     <SpecialSkillsDisplayCharacter skill={skill} />
                   </div>
                 ))}
               </>
               : <div>
               </div>
           }
         </div>
      </div>
    </>
}

{
  props.character.gmnotes.length > 0
    ?  
      !props.extraGmSpaceOn.isactive ?
        <div className='sheet sheet3'>
          <div className='gm-notes'>
            <div className='gm-notes-heading'>GM Notes for {props.character.name}</div>
            <div className='gm-notes-text'>
              {props.character.gmnotes.split('\n').map(str => <p key={Math.Random()}> {str}</p>)}
              </div>
          </div>
        </div>
      : <>
          <div className='sheet sheet3'>
            <div className='gm-notes'>
              <div className='gm-notes-heading'>GM Notes for {props.character.name} [1]</div>
              <div className='gm-notes-text'>
                {props.extraGmSpaceOn.page1.split('\n').map(str => <p key={Math.Random()}>{str}</p>)}
                </div>
            </div>
          </div>
          <div className='sheet sheet3' >
          <div className='gm-notes'>
            <div className='gm-notes-heading'>GM Notes for {props.character.name} [2]</div>
            <div className='gm-notes-text'>
              {props.extraGmSpaceOn.page2.split('\n').map(str => <p key={Math.Random()}>{str}</p>)}
              </div>
          </div>
          </div> 
        </>
      : null
}

{
  props.character.starting_Items !== undefined && props.character.starting_Items.length > 0 && props.character.starting_Items.length <= 9
  ? <div className='sheet sheet4'>
      <ItemPalette apiMessage={props.character.starting_Items} remove={() => null}></ItemPalette>
    </div>
  : props.character.starting_Items !== undefined && props.character.starting_Items.length > 9 && props.character.starting_Items.length < 19
    ? <>
        <div className='sheet sheet4'>
          <ItemPalette apiMessage={props.fullItems[0]} remove={() => null}></ItemPalette>
        </div>
        <div className='sheet sheet5'>
          <ItemPalette apiMessage={props.fullItems[1]} remove={() => null}></ItemPalette>
        </div>
      </>
    :  props.character.starting_Items !== undefined && props.character.starting_Items.length > 18
    ? <>
        <div className='sheet sheet4'>
          <ItemPalette apiMessage={props.fullItems[0]} remove={() => null}></ItemPalette>
        </div>
        <div className='sheet sheet5'>
          <ItemPalette apiMessage={props.fullItems[1]} remove={() => null}></ItemPalette>
        </div>
        <div className='sheet sheet6'>
          <ItemPalette apiMessage={props.fullItems[2]} remove={() => null}></ItemPalette>
        </div>
      </>
    : null
}
</div>
    )
}
    export default CharacterDisplay;

    CharacterDisplay.propTypes = {
        props: PropTypes.object,
        character: PropTypes.object,
        formJSON: PropTypes.object,
        JSONData: PropTypes.object,
        imageData: PropTypes.object,
        specialSkillSpace: PropTypes.object,
        extraGmSpaceOn: PropTypes.object,
        itemList: PropTypes.array,
        fullItems: PropTypes.array
      }