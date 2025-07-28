import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import CharacterWrapperNo from '../character/characterwrapperno';
import ItemPaletteWrapper from '../itempalette/itempalettewrapper';
import CharacterGMNotes from '../character/charactergmnotes';

const DisplayScreen = props => {

    const charComponent = React.useRef(null);

    
    const [fullItems, setFullItems] = useState([]);
    const [isDoublesidePrint, setIsDoublesidePrint] = useState(true);


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

    const [fontSize, setFontSize] = useState({
        fontSize: 'normal'
      })
      const [fontType, setFontType] = useState({
        fontType: 'normal'
      })

      useEffect(() => {
        initForm()
        //var hashid = ".character-sheet-printable";
        //setElement(document.querySelector(hashid));
        //setHtmlStyles(document.querySelectorAll("style"));
      }, [])

      const initForm = async () => {

        if (props.id === 'character') {
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
       }
       else if (props.itemList !== undefined && props.itemList !== null) {
        let i = 0;
        let j = 0;
        let fullListOrdered = [];
        let fullItemList = [];
        fullListOrdered.push([]);
    
    
        if (props.itemList !== undefined && props.itemList !== null){
        while (i < props.itemList.length) {
    
          let itemName = props.itemList[i].name
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
          }
    
          if (fullListOrdered[j].length === 9) {
            fullListOrdered.push([]);
            j++;
          }
          i++;
        }
      }
        setFullItems(fullListOrdered);
       }
      }

      const changePrintSides = () => {
let toggle=!isDoublesidePrint;
setIsDoublesidePrint(toggle);
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
 /*           if (props.character.gmnotes.length > 2774) {
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
          } */
/*           var skillsContainer = document.querySelector(".special-skills");
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
          } */
        }
      }

    const printFn = useReactToPrint({
        contentRef: charComponent,
        documentTitle: props.id === 'character' ?  props.character.name+' / '+props.character.seriesTitle : "items_" + Date().toLocaleString()
    });

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
        { isDoublesidePrint===true
          ? <button className='change-print-single-side-print button-action' onClick={changePrintSides}>Single Side Print</button>
          : <button className='change-print-double-side-print button-action' onClick={changePrintSides}>Double Side Print</button>
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
          <div>
          {
            isDoublesidePrint===true
            ? <span><b>Print Style:</b> Double</span>
            : <span><b>Print Style:</b> Single</span>
          }
          </div>
        </div>
        <div className='sheet-print-info'>Note: On print, certain things may appear out of place if viewing it in the new browser window. They should move into correct place inside of the print view.</div>
      </div>
      <div ref={charComponent} className='character-sheet-printable' >

      { props.id === 'character' ?
        <div>     
      <CharacterWrapperNo  extraGmSpaceOn={extraGmSpaceOn} 
      specialSkillSpace={specialSkillSpace} 
      fontSize={fontSize} fontType={fontType} 
      id="character" formJSON={props.formJSON} character={props.character} path={props.path} guid={props.guid}/>
      </div> :
      <></>
       }
      <div>    
      <ItemPaletteWrapper printfrontback={isDoublesidePrint} itemsList={props.id === 'character' ? props.character.starting_Items : props.itemList}
       itemsList2={props.id === 'character' ? props.character.upgrade_Items : []}  fullItems={props.id === 'character' ? fullItems : props.itemList} />
      </div>
      { props.character !== undefined && props.character !== null ?
      <CharacterGMNotes character={props.character}/> :
       <></>}
      </div>
</>
)
}

export default DisplayScreen;

DisplayScreen.propTypes = {
    props: PropTypes.object,
    character: PropTypes.object,
    formJSON: PropTypes.object,
    path: PropTypes.string,
    guid: PropTypes.string,
    id: PropTypes.string,
    itemList: PropTypes.array
  }