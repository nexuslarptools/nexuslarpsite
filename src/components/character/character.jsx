import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import CharacterSheetHeading from '../charactersections/charactersheetheading';
import CharacterSheetTable from '../charactersections/charactersheettable';
import Item from '../item/item';
import SpecialSkillsDisplayCharacter from '../specialskills/specialskillsdisplaycharacter';
import ItemPalette from '../itempalette/itempalette';
import { useReactToPrint } from 'react-to-print';

const Character = props => {

  const charComponent = React.useRef(null);
  const [JSONData, setJSONData] = useState({
    formData: [],
    show: false
  })
  const [imageData, setImageData] = useState({
    image1: '',
    image2: ''
  })
  const [fontSize, setFontSize] = useState({
    fontSize: 'normal'
  })
  const [fontType, setFontType] = useState({
    fontType: 'normal'
  })
  const [fullItems, setFullItems] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [extraGmSpaceOn, setExtraGmSpaceOn] = useState({
    isactive: false,
    page1: '',
    page2: ''
  });
  const [specialSkillSpace, setSpecialSkillSpace] = useState({
    isactive: false,
    page1: [],
    page2: []
  });

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
      image1: 'data:image/png;base64,' + props.character.imagedata1,
      image2: 'data:image/png;base64,' + props.character.imagedata2
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

    setFullItems(fullListOrdered);
    setItemList(fullItemList);
  }

  const changeFontType = () => {
    var sheet = document.querySelector(".character-sheet-printable");
    if (fontType.fontType === 'dyslexia'){
      sheet.classList.remove("dyslexic-assist");
      setFontType({fontType: "normal"});
    }
    else {
      sheet.classList.add("dyslexic-assist");
      setFontType({fontType: "dyslexia"});
    }
  }

  const changeFontSize = () => {
    var sheet = document.querySelector(".character-sheet-printable");
    if (fontSize.fontSize === 'large'){
      sheet.classList.remove("large-print");
      setFontSize({fontSize: "normal"});
      setExtraGmSpaceOn({    
        isactive: false,
        page1: '',
        page2: ''});
        setSpecialSkillSpace({
          isactive: false,
          page1: [],
          page2: []
        });
    }
    else {
      sheet.classList.add("large-print");
      setFontSize({fontSize: "large"});
      if (props.character.gmnotes.length > 2774) {
        let Gm1 = '';
        let Gm2 = '';
        const split1 = props.character.gmnotes.split('\n');
        if (split1.length > 1) {
          let i = 0;
          while (Gm1.length + split1[i].length < 2774) {
            Gm1 = Gm1 + split1[i]+'\n';
            i++;
          }
          while (i < split1.length) {
            Gm2 = Gm2 + split1[i]+'\n';
            i++;
          }
        }
        if (split1.length <= 1 || Gm1.length > 2774 || Gm2.length > 2774 ) {
          const split2 = props.character.gmnotes.split(' ');
          if (split2.length > 1) {
            let i = 0;
            while (Gm1.length + split2[i].length < 2774) {
              Gm1 = Gm1 + split2[i]+'\n';
              i++;
            }
            while (i < split2.length) {
              Gm2 = Gm2 + split2[i]+'\n';
              i++;
            }
        }
      }

        setExtraGmSpaceOn({    
          isactive: true,
          page1: Gm1,
          page2: Gm2});
      }
      var skillsContainer = document.querySelector(".special-skills");
      if (skillsContainer.clientHeight > 956) {
        let j = 0;
        let skills1=[];
        let skills2=[];
        while (j < props.character.fields.Special_Skills.length - 2) {
          skills1.push(props.character.fields.Special_Skills[j]);
          j++;
        }

        while (j < props.character.fields.Special_Skills.length) {
          skills2.push(props.character.fields.Special_Skills[j]);
          j++;
        }

        setSpecialSkillSpace({
          isactive: true,
          page1:skills1,
          page2:skills2
        })
      }
    }
  }

  const printFn = useReactToPrint({
    contentRef: charComponent,
    documentTitle: props.character.name+' / '+props.character.seriesTitle
});

  const handlePrint = (tagid) => {
    var hashid = "."+ tagid;
    var element = document.querySelector(hashid);
    var divToPrint = element.outerHTML;
    var htmlStyles = document.querySelectorAll("style");
    var head = '<html><head><title>'+props.character.name+' / '+props.character.seriesTitle+'</title>';
    htmlStyles.forEach(style => {
      head = head+style.outerHTML;
    })
    head = head+'</head>';
    var allcontent = head + "<body onload='window.print()'><div>" + divToPrint + "</div></body></html>";
    var newWin = window.open('','Print-Window');
    newWin.document.open();
    newWin.document.write(allcontent);
    newWin.document.close();
  }

  if (!props || !JSONData.show) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
    <>
      <div className='sheet-option-buttons'>
        <button className="button-action print-sheet-button" onClick={printFn}>Print This Sheet</button>
        { fontSize.fontSize === 'normal'
          ? <button className='change-font-size-large-button button-action' onClick={changeFontSize}>Large Font Size</button>
          : <button className='change-font-size-normal-button button-action' onClick={changeFontSize}>Normal Font Size</button>
        }
        { fontType.fontType === 'normal'
          ? <button className='change-font-dyslexia-button button-action' onClick={changeFontType}>Dyslexia Aid Font</button>
          : <button className='change-font-default-button button-action' onClick={changeFontType}>Default Font</button>
        }
        <div className='sheet-print-active-states'>
          <div className='sheet-print-active-states-label'>Active Sheet States</div>
          <div>
          {
            fontSize.fontSize === 'normal'
            ? <span><b>Size:</b> Default</span>
            : <span><b>Size:</b> Large</span>
          }
          </div>
          <div>
          {
            fontType.fontType === 'normal'
            ? <span><b>Font:</b> Default</span>
            : <span><b>Font:</b> Dyslexia Assist</span>
          }
          </div>
        </div>
        <div className='sheet-print-info'>Note: On print, certain things may appear out of place if viewing it in the new browser window. They should move into correct place inside of the print view.</div>
      </div>

      <div ref={charComponent} className='character-sheet-printable' >
        <div className='sheet sheet1'>
          <div className='header-info'>
            <div className='sheet-name-series'>
            { props.character.name.length < 31 ?
              <div className='sheetName'>{props.character.name}</div> :
              <div className='sheetNameSM'>{props.character.name}</div> 
            }
              { props.character.seriesTitle.length < 31 ?
              <div className='seriesName'>{props.character.seriesTitle}</div> :
              <div className='seriesNameSM'>{props.character.seriesTitle}</div>
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
                <div className='sheet-item'><Item item={props.character.sheet_Item} type={"sheet"}></Item></div>
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

              { imageData.image2 !== undefined && imageData.image2 !== null && imageData.image2 !== '' && imageData.image2 !== 'data:image/png;base64,null' ?
                <div className='imgContainer full-body-image'>
                  <img src={imageData.image2} className='charFullBodyImg' alt="character full body shot"></img>
                </div> 
                : <></> 
              }
            </div>
            
          </div>
          <div className="starting-items">
            <div className='starting-items-header'>Starting Items: <span className='starting-items-amount'>({props.character.starting_Items !== undefined ? props.character.starting_Items.length : 0})</span></div>
            <div className='starting-items-list'>
              {itemList.map((item, i) => 
                i + 1 === itemList.length
                  ? item.itemName
                  :  item.total > 1
                  ?  item.itemName + ' (' + item.total + '),  '
                    : item.itemName + ',  '
              )}
            </div>
          </div>
        </div>
        { 
          !specialSkillSpace.isactive ?
            <div className='sheet sheet2'>
              <div className='header-info'>
                <div className='sheet-name-series'>
                { props.character.name.length < 31 ?
                  <div className='sheetName'>{props.character.name}</div> :
                  <div className='sheetNameSM'>{props.character.name}</div> 
                  }
                  { props.character.seriesTitle.length < 30 ?
                  <div className='seriesName'>{props.character.seriesTitle}</div> :
                  <div className='seriesNameSM'>{props.character.seriesTitle}</div>
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
                  specialSkillSpace.page1 != null && specialSkillSpace.page1.length > 0 && specialSkillSpace.page1 != null
                    ? <>
                      {specialSkillSpace.page1.map((skill, index) => (
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
                     specialSkillSpace.page2 != null && specialSkillSpace.page2.length > 0 && specialSkillSpace.page2[0] != null
                       ? <>
                         {specialSkillSpace.page2.map((skill, index) => (
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
              !extraGmSpaceOn.isactive ?
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
                        {extraGmSpaceOn.page1.split('\n').map(str => <p key={Math.Random()}>{str}</p>)}
                        </div>
                    </div>
                  </div>
                  <div className='sheet sheet3' >
                  <div className='gm-notes'>
                    <div className='gm-notes-heading'>GM Notes for {props.character.name} [2]</div>
                    <div className='gm-notes-text'>
                      {extraGmSpaceOn.page2.split('\n').map(str => <p key={Math.Random()}>{str}</p>)}
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
                  <ItemPalette apiMessage={fullItems[0]} remove={() => null}></ItemPalette>
                </div>
                <div className='sheet sheet5'>
                  <ItemPalette apiMessage={fullItems[1]} remove={() => null}></ItemPalette>
                </div>
              </>
            :  props.character.starting_Items !== undefined && props.character.starting_Items.length > 18
            ? <>
                <div className='sheet sheet4'>
                  <ItemPalette apiMessage={fullItems[0]} remove={() => null}></ItemPalette>
                </div>
                <div className='sheet sheet5'>
                  <ItemPalette apiMessage={fullItems[1]} remove={() => null}></ItemPalette>
                </div>
                <div className='sheet sheet6'>
                  <ItemPalette apiMessage={fullItems[2]} remove={() => null}></ItemPalette>
                </div>
              </>
            : null
        }
      </div>
    </>
    )
  }
}

export default Character;

Character.propTypes = {
  props: PropTypes.object,
  character: PropTypes.object,
  formJSON: PropTypes.object
}