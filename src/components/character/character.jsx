import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import CharacterDisplay from './characterdisplay';
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
    documentTitle: "AwesomeFileName"
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
      <div ref={charComponent}>
      <CharacterDisplay character={props.character} imageData={imageData} JSONData={JSONData}
       itemList={itemList} specialSkillSpace={specialSkillSpace} extraGmSpaceOn={extraGmSpaceOn} 
       fullItems={fullItems}/>
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