import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import CharacterSheetHeading from '../charactersections/charactersheetheading';
import CharacterSheetTable from '../charactersections/charactersheettable';
import SpecialSkillsDisplayCharacter from '../specialskills/specialskillsdisplaycharacter';
import PopupItem from '../item/popupitem';
import ItemWrapper from '../item/itemWrapper';
import Startingitems from '../text/startingitemsresult';

const CharacterNo = props => {

  const charComponent = React.useRef(null);
  const [JSONData, setJSONData] = useState({
    formData: [],
    show: false
  })
  const [imageData, setImageData] = useState({
    image1: '',
    image2: ''
  })
  const [itemList, setItemList] = useState([]);


  useEffect(() => {
    initForm(props.formJSON)
    //var hashid = ".character-sheet-printable";
    //setElement(document.querySelector(hashid));
    //setHtmlStyles(document.querySelectorAll("style"));
  }, [])

  const initForm = async (formJSON) => {
    const formData = []

    for (const key of Object.keys(formJSON)) {
      let sectionData = ''
      for (const subkey of Object.keys(formJSON[key].Values)) {
        const formValue = props.character.fields[subkey]
        if (formJSON[key].Values[subkey].Display) {
          const jsonItem = {
            [subkey]: {
              Type: formJSON[key].Values[subkey].Type,
              Name: formJSON[key].Values[subkey].Label,
              Value: formValue
            }
          }
          sectionData = Object.assign(sectionData, jsonItem)
        }
      }
      const section = {
        Heading: formJSON[key].Heading,
        Values: sectionData
      }
      formData.push(section)
    }
    await setJSONData({
      ...JSONData,
      formData,
      show: true
    })
    setImageData({
      ...imageData,
      image1: props.img,
      image2: props.img2
    })

    let i = 0;
    let j = 0;
    let fullListOrdered = [];
    let fullItemList = [];
    fullListOrdered.push([]);


    if (props.character.starting_Items !== undefined){
    while (i < props.character.starting_Items.length) {

      let itemName = props.character.starting_Items[i].name
      let k = 0;
      let listItem = null;

    while (k < fullItemList.length) {
      if (fullItemList[k].itemName ===  itemName) {
        let itemtotal = fullItemList[k].total + 1;
        listItem = { 
          itemName: itemName,
          total: itemtotal
        }
        fullItemList[k] = listItem
        k = fullItemList.length;
      }
      k++;
    }


      if (listItem === null) {
       listItem = { 
        itemName: itemName,
        total: 1
      }
      fullItemList.push(listItem);
      }

      fullListOrdered[j].push(props.character.starting_Items[i]);
      if (fullListOrdered[j].length === 9) {
        fullListOrdered.push([]);
        j++;
      }
      i++;
    }
  }

    setItemList(fullItemList);
  }

  if (!props || !JSONData.show) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
    <>
      <div ref={charComponent} className='character-sheet-printable' >
        <div className='sheet sheet1'>
          <div className='header-info'>
            <div className='sheet-name-series'>
            { props.character.name.length > 30 || props.character.seriesTitle.length > 50 ?
                <div className='sheetNameSM'>{props.character.name}</div>
               :<div className='sheetName'>{props.character.name}</div>  
            }
              { props.character.seriesTitle.length > 71 ?
              <div className='seriesNameXSM'>{props.character.seriesTitle}</div> :
              props.character.seriesTitle.length > 30 ?
              <div className='seriesNameSM'>{props.character.seriesTitle}</div> :
              <div className='seriesName'>{props.character.seriesTitle}</div>
              }
            </div>
            <CharacterSheetHeading img={imageData.image1}  other={JSONData.formData[0]} attributes={JSONData.formData[1]} />
          </div>
          <div className='allSkills-and-sheet-item-container'>
            <div className='standard-skills'>
              <div className='skills-table'><CharacterSheetTable list={JSONData.formData[2]} tableClasses={'skills1 sheet-table'} tableName={'Standard Skills'}  /></div>
            </div>
            <div className='combat-skills-and-sheet-item-container'>
              <div className='skills-table'><CharacterSheetTable list={JSONData.formData[3]} tableClasses={'combat sheet-table'} tableName={'Combat Skills'}  /></div>
              <div className='sheet-item-container'>
                <div className='sheet-item'>
                {props.character.sheet_Item !== undefined && props.character.sheet_Item !== null ?
                  <ItemWrapper  path={props.character.sheet_Item.secondapprovalbyuserGuid !== null ? 'Approved' : 'UnApproved'} 
                  guid={props.character.sheet_Item.guid}  item={props.character.sheet_Item} type={"sheet"}></ItemWrapper> :
                  (props.character.sheet_ItemGuid !== undefined && props.character.sheet_ItemGuid !== null ?
                  <PopupItem guid={props.character.sheet_ItemGuid} type={"sheet"}></PopupItem> :
                   <></>)
                  }
                </div>
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

              { imageData.image2 !== undefined && imageData.image2 !== null && imageData.image2 !== '' && 
              imageData.image2 !== 'data:image/png;base64,null' ?
                <div className='imgContainer full-body-image'>
                  <img src={imageData.image2} className='charFullBodyImg' alt="character full body shot"></img>
                </div> 
                : <></> 
              }
            </div>
            
          </div>
          <div className="starting-items">
            <div className='starting-items-header'>Starting Items: <span className='starting-items-amount'>
              {(props.character.starting_Items !== undefined 
              && props.character.starting_Items.length > 0) ||
              (props.character.fields.iteminfo === undefined 
                || props.character.fields.iteminfo === null
                || props.character.fields.iteminfo === '') ? props.character.starting_Items !== undefined ?
                "(" + props.character.starting_Items.length + ")" : "(" + 0 + ")" : ""}</span></div>


{/* 
             <div className='starting-items-list'>
             {props.character.fields.iteminfo !== undefined 
              && props.character.fields.iteminfo !== null
              && props.character.fields.iteminfo !== '' ? 
              props.character.fields.iteminfo + " " : null
              }
            {itemList.length > 0 ? itemList.map((item, i) => 
                i + 1 === itemList.length
                  ? item.itemName
                  :  item.total > 1
                  ?  item.itemName + ' (' + item.total + '),  '
                    : item.itemName + ',  '
              ) :
                 (props.character.fields.iteminfo !== undefined 
              && props.character.fields.iteminfo !== null
              && props.character.fields.iteminfo !== '' ? null : 'No Starting Items')
              }
            </div>
 */}
         <Startingitems iteminfo={props.character.fields.iteminfo} itemList={itemList} />

          </div>
        </div>
        { 
          !props.specialSkillSpace.isactive ?
            <div className='sheet sheet2'>
              <div className='header-info'>
                <div className='sheet-name-series'>
                { props.character.name.length > 30 || props.character.seriesTitle.length > 50 ?
                <div className='sheetNameSM'>{props.character.name}</div>
               :<div className='sheetName'>{props.character.name}</div>  
            }
              { props.character.seriesTitle.length > 71 ?
              <div className='seriesNameXSM'>{props.character.seriesTitle}</div> :
              props.character.seriesTitle.length > 30 ?
              <div className='seriesNameSM'>{props.character.seriesTitle}</div> :
              <div className='seriesName'>{props.character.seriesTitle}</div>
              }
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

              { props.specialSkillSpace.page2 != null && props.specialSkillSpace.page2.length > 0 && props.specialSkillSpace.page2[0] != null ?
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
              :<></>
  }
            </>
        }
      </div>
    </>
    )
  }
}

export default CharacterNo;

CharacterNo.propTypes = {
  props: PropTypes.object,
  character: PropTypes.object,
  formJSON: PropTypes.object,
  img: PropTypes.string,
  img2: PropTypes.string,
  extraGmSpaceOn: PropTypes.object, 
  specialSkillSpace: PropTypes.object, 
  fontSize: PropTypes.object,  
  fontType: PropTypes.object 
}