import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Form, FormGroup } from 'reactstrap';
import ItemAbilites from '../specialskills/ItemAbilites';
import MultiTextField from '../inputs/multitextfield';
import {
  Autocomplete, TextField,
  FormControlLabel, FormLabel, Input, Box, Checkbox, Select, MenuItem
} from '@mui/material';
import { green } from '@mui/material/colors';
import PhotoCropper from '../photocropper/photocropper';
import Item from '../item/item';

const ItemEditForm = (props) => {
    const formRef = React.useRef();
    const { register, handleSubmit, setValue } = useForm({
      mode: 'onSubmit',
      reValidateMode: 'onBlur'
    });
    const [finalImage, setFinalImage] = useState(null);
    const [itemData, setItemData] = useState({
      "seriesguid": "",
      "series": "",
      "name": "",
      "img1": "",
      "fields": {
          "TYPE": "Generic",
          "Description": ""
      },
      "gmnotes": null,
      "reason4edit": null,
      "tags": [
      ],
      "imagedata": null,
      "readyforapproval": false,
      "hasreview": false,
      "isdoubleside":false,
      "doubleside":{},
      "back": {
        "fields": {
          "Description": ""
      }
      }
  });
    const [JSONData, setJSONData] = useState([]);
    const [gmNotes, setGMNotes] = useState('');
    const [selectedOption, setSelectedOption] = useState('Generic');
    const [IsdoubleSide, setIsdoubleSide] = useState(false);
    const [selectedSeries, setSelectedSeries] = useState(
      '045a829c-8cff-11ea-99f9-4371def66a6d'
    );
    const [tagState, setTagState] = useState({
      showResult: false,
      apiMessage: [],
      listTags: [],
      taglocation: -1
    });

    const [abilitesFormsState, setAbilitesForms] = useState({
      abilitiesFormList: JSON.parse(
        JSON.stringify([{ arraynum: 0, visible: false }])
      ),
      showResult: true
    });

    const [abilitesBackFormsState, setAbilitesBackForms] = useState({
      abilitiesFormList: JSON.parse(
        JSON.stringify([{ arraynum: 0, visible: true }])
      ),
      showResult: true
    });

    const [abilitiesState, setAbilities] = useState({
      abilitiesList: JSON.parse(JSON.stringify([{ arraynum: 0, visible: true }])),
      abilitiesListBack: JSON.parse(JSON.stringify([{ arraynum: 0, visible: true }])),
      showResult: true
    });

    const [itemsTableState, setItemsTableState] = useState({
      show: false,
      isMounted: false,
      label: '',
      sheetItem: '',
      sheetItemGuid: '',
      sheetItemFullItem: [],
      startingItems: [],
      startingItemGuids: [],
      startingItemFullItems: []
    });

    const [formdata, setFormdata] = useState(null);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(
      {open:false,
      row:null});

      useEffect(() => {
        initForm();
      }, [props.initForm])

      const initForm = async () => {
        const formData = [];
    
        for (const key of Object.keys(props.formJSON)) {
          const sectionData = [];
          for (const subkey of Object.keys(props.formJSON[key].Values)) {
            const jsonItem = {
              Label: props.formJSON[key].Values[subkey].Label,
              Type: props.formJSON[key].Values[subkey].Type,
              ToolTip: props.formJSON[key].Values[subkey].ToolTip,
              Name: subkey,
              Limit: props.formJSON[key].Values[subkey].Limit,
              Types: props.formJSON[key].Values[subkey].Types,
              enums: props.formJSON[key].Values[subkey].enums,
            }
            sectionData.push(jsonItem);
          }
          const section = {
            Heading: props.formJSON[key].Heading,
            Types: props.formJSON[key].Types,
            Values: sectionData,
            IsdoubleSide: props.formJSON[key].IsdoubleSide
          }
          formData.push(section);
        }
        await setJSONData(formData);
    
        const loopData = [];
        const loopDataWithNulls = [];
        const backLoopData = [];
        const backLoopDataWithNulls = [];
    
        if (props.initForm.showResult) {
          await setIsdoubleSide(props.initForm.apiMessage.isdoubleside);
          await setItemData(props.initForm.apiMessage);
          await setSelectedOption(props.initForm.apiMessage.fields.TYPE);
          await setFinalImage({FinalImage:
            'data:image/png;base64,' + props.initForm.apiMessage.imagedata,
            Blob: 'data:image/png;base64,' + props.initForm.apiMessage.imagedata })

          if (props.initForm.apiMessage.fields.Special_Skills) {
            for (
              let i = 0;
              i < props.initForm.apiMessage.fields.Special_Skills.length;
              i++
            ) {
              let oldName = props.initForm.apiMessage.fields.Special_Skills[i].Name
              let oldCost = props.initForm.apiMessage.fields.Special_Skills[i].Cost
              const oldRank =
                props.initForm.apiMessage.fields.Special_Skills[i].Rank
              let oldDescription =
                props.initForm.apiMessage.fields.Special_Skills[i].Description
              let oldTags = props.initForm.apiMessage.fields.Special_Skills[i].Tags

              const initial =[];
              oldTags.forEach(oldguid => {
                initial.push(props.tagslist.abilityTags.find((tagf) => tagf.guid === oldguid))
              });
    
              let newData = JSON.parse(
                JSON.stringify({
                  arraynum: i,
                  visible: true,
                    Name: oldName,
                    Cost: oldCost,
                    Rank: oldRank,
                    Description: oldDescription,
                    Tags: oldTags,
                    initialTags: initial

                })
              );
    
              loopData.push(newData);
    
              if (oldName === '') {
                oldName = null;
              }
    
              if (oldCost === '') {
                oldCost = null;
              }
    
              if (oldDescription === '') {
                oldDescription = null;
              }
    
              if (oldTags === '') {
                oldTags = null;
              }
    
              newData = JSON.parse(
                JSON.stringify({
                  arraynum: i,
                  visible: true,
                    Name: oldName,
                    Cost: oldCost,
                    Rank: oldRank,
                    Description: oldDescription,
                    Tags: oldTags
                })
              )
              loopDataWithNulls.push(newData);
            }
          }


          if (props.initForm.apiMessage.back.fields.Special_Skills) {
            for (
              let i = 0;
              i < props.initForm.apiMessage.back.fields.Special_Skills.length;
              i++
            ) {
              let oldName = props.initForm.apiMessage.back.fields.Special_Skills[i].Name
              let oldCost = props.initForm.apiMessage.back.fields.Special_Skills[i].Cost
              const oldRank =
                props.initForm.apiMessage.back.fields.Special_Skills[i].Rank
              let oldDescription =
                props.initForm.apiMessage.back.fields.Special_Skills[i].Description
              let oldTags = props.initForm.apiMessage.back.fields.Special_Skills[i].Tags

              const initial =[];
              oldTags.forEach(oldguid => {
                initial.push(props.tagslist.abilityTags.find((tagf) => tagf.guid === oldguid))
              });
              
              let newData = JSON.parse(
                JSON.stringify({
                  arraynum: i,
                  visible: true,
                    Name: oldName,
                    Cost: oldCost,
                    Rank: oldRank,
                    Description: oldDescription,
                    Tags: oldTags,
                    initialTags: initial

                })
              );
    
              backLoopData.push(newData);
    
              if (oldName === '') {
                oldName = null;
              }
    
              if (oldCost === '') {
                oldCost = null;
              }
    
              if (oldDescription === '') {
                oldDescription = null;
              }
    
              if (oldTags === '') {
                oldTags = null;
              }
    
              newData = JSON.parse(
                JSON.stringify({
                  arraynum: i,
                  visible: true,
                    Name: oldName,
                    Cost: oldCost,
                    Rank: oldRank,
                    Description: oldDescription,
                    Tags: oldTags
                })
              )
              backLoopDataWithNulls.push(newData);
            }
          }



          await setSelectedSeries(props.initForm.apiMessage.seriesguid);

        let fullListOrdered = []
        fullListOrdered.push([]);
          upDateTags(props.initForm.apiMessage.tags);
        } 

        setAbilitesForms({
          ...abilitesFormsState,
          abilitiesFormList: loopDataWithNulls
        });

        setAbilitesBackForms({
          ...abilitesFormsState,
          abilitiesFormList: backLoopDataWithNulls
        });

        setAbilities({
          ...abilitiesState,
          abilitiesList: loopData,
          abilitiesListBack: backLoopData
        });

        if (props.initForm.apiMessage !== undefined && props.initForm.apiMessage !== null
            && props.initForm.apiMessage.gmnotes !== null) {
        setGMNotes(props.initForm.apiMessage.gmnotes);
        }
        else {
          setGMNotes('');
        }
        await setItemsTableState({
            ...itemsTableState,
            isMounted: true
          });
      }

      const ToggleDoubleSide = async () => {
        let currdeoubleside = !IsdoubleSide;
        setIsdoubleSide(currdeoubleside);

        await setItemData({
          ...itemData,
          isdoubleside: currdeoubleside
        });
      }

    const handleFormSubmit = async (data) => {

      if (props.formJSON.some((section) => (
        section.Values.some((item) => (
        item.Type === 'SpecialSkillsInput'  && item.Types.some(type => type === 'All' || type === selectedOption)))))) {
          const fullist = [];
          abilitiesState.abilitiesList.forEach(element => {
            fullist.push(element.Special);
          });
          data.Special_Skills = fullist;
        }
        let outputbody= {
          Fields: {
            Name:data.Name
          },
          Name:data.Name
        }

        outputbody.Type = itemData.fields.TYPE;

        props.formJSON.forEach(heading => {
           heading.Values.forEach(value => {
            if (value.Types.some(type => type === 'All' || type === selectedOption)) {
              outputbody.Fields[value.Name] = data[value.Name];
            }
          });
        });

        if (finalImage.Blob != null) {
          const arr = finalImage.Blob.split(',');
          outputbody.imagedata = arr[1];
      }
        outputbody.Seriesguid =selectedSeries;
        outputbody.Gmnotes =gmNotes;
        outputbody.IsdoubleSide = IsdoubleSide;

        if ( props.initForm !== null && props.initForm.apiMessage !== null)
        {
          outputbody.guid = props.initForm.apiMessage.guid;
        }

        outputbody.Fields.Tags = tagState.listTags;
        if (itemData.fields.Special_Skills !== undefined && itemData.fields.Special_Skills !== null) {
          itemData.fields.Special_Skills.forEach(skill => { 
            if(skill.visible !== true) {
              const index = itemData.fields.Special_Skills.indexOf(skill);
                 if (index > -1) { 
                    itemData.fields.Special_Skills.splice(index, 1);
                  }
            }
          });
          outputbody.Fields.Special_Skills = itemData.fields.Special_Skills;
        }

        if (itemData.back !== undefined && itemData.back.fields.Special_Skills !== undefined 
          && itemData.back.fields.Special_Skills !== null) {

            itemData.back.fields.Special_Skills.forEach(skill => { 
              if(skill.visible !== true) {
                const index = itemData.back.fields.Special_Skills.indexOf(skill);
                   if (index > -1) { 
                      itemData.back.fields.Special_Skills.splice(index, 1);
                    }
              }
            });

          outputbody.Back = itemData.back;
        }
        props.SubmitForm(outputbody);
      }

      const updateValue = async (e, i) => {
        if (i !== true && i !== false) {
        await setValue(e.target.name, e.target.value);
        
        if (e.target.name === 'Description2ndSide') {
          let back = itemData.back;
          back.fields.Description = e.target.value;
          await setItemData({
            ...itemData,
            back: back
          });
        } else {
        let itemFields = itemData.fields;
        itemFields[e.target.name] = e.target.value;
        await setItemData({
          ...itemData,
          fields: itemFields
        });
        if (e.target.name === 'Name') {
          await setItemData({
            ...itemData,
            name: e.target.value
          });
        }
        if (e.target.name === 'TYPE') {
            await setSelectedOption(e.target.value)

            for (var index = 0; index < JSONData.length; ++index) {
                for (var index2 = 0; index2 < JSONData[index].Values.length; ++index2) {


               if (JSONData[index].Values[index2].Type !== 'SpecialSkillsInput' &&
                    !JSONData[index].Values[index2].Types.some(type => type === 'All' || type === e.target.value)
                    ) {
                        let fieldname = JSONData[index].Values[index2].Name;
                        setValue(fieldname, '');
                }

                if (JSONData[index].Values[index2].Type === 'SpecialSkillsInput' &&
                !JSONData[index].Values[index2].Types.some(type => type === e.target.value)
                ) {

            await setAbilitesForms({
                ...abilitesFormsState,
                abilitiesFormList: []
              });
              await setAbilities({
                ...abilitiesState,
                abilitiesList: []
              });

            }
        }
        }

            if (JSONData.Type === 'SpecialSkillsInput'
                //item.Types.some(type => type === 'All' || type === e.target.value)
                ) {

            setAbilitesForms({
                ...abilitesFormsState,
                abilitiesFormList: []
              });
              setAbilities({
                ...abilitiesState,
                abilitiesList: []
              });
            }
        }

        setFormdata({
          ...formdata,
          [e.target.name]: e.target.value});
        }
      }
        else {
          let itemFields = itemData.fields;
          itemFields[e.target.name] = i;
          await setItemData({
            ...itemData,
            fields: itemFields
          });
          await setValue(e.target.name, i);
          await setFormdata({
            ...formdata,
            [e.target.name]: i});
        }
      
    }

      const updateMultiValue = (e) => {
        const allvals = [];
        e.fieldValues.forEach((value) => {
          if (value.visible) {
            allvals.push(value.fieldValue);
          }
        })
        setValue(e.fieldname, allvals);
      }

      const upDateSeries = (e) => {
        if (e === null) {
          setSelectedSeries(e);
          return;
        }
        setSelectedSeries(e.guid);
      }

      const upDateTags = (e) => {
        const listguids = [];
        const listElements = [];

        e.forEach((element) => {
            if (!listguids.some((ele) => ele === element.guid)){
            listguids.push(element.guid);
            listElements.push(element);
            }
        })
        setTagState({
            ...tagState,
            listTags: listguids,
            listElements: listElements
        });
    }

    const addAbilityForm = (e, name) => {
      e.preventDefault();

      if (name === 'Special_Skills') {
      const i = abilitiesState.abilitiesList.length;
      const newform = JSON.parse(JSON.stringify({
        arraynum: i,
        visible: true,
        Special: {
          name: '',
          Cost: null,
          Rank: null,
          Description: '',
          Tags: []
        }
      }));
      const newData = [];
  
      for (let j = 0; j < i; j++) {
        newData.push(abilitiesState.abilitiesList[j]);
      }
  
      newData.push(newform);
  
      setAbilities({
        ...abilitiesState,
        abilitiesList: newData
      })
    }     
    else {
      const i = abilitiesState.abilitiesListBack.length;
      const newform = JSON.parse(JSON.stringify({
        arraynum: i,
        visible: true,
        Special: {
          name: '',
          Cost: null,
          Rank: null,
          Description: '',
          Tags: []
        }
      }));
      const newData = [];
  
      for (let j = 0; j < i; j++) {
        newData.push(abilitiesState.abilitiesListBack[j]);
      }
  
      newData.push(newform);
  
      setAbilities({
        ...abilitiesState,
        abilitiesListBack: newData
      })
    }
      
    }
    const handleDeleteClose = () => {
      setDeleteDialogOpen({
        open:false,
        row:null
      });
    }

  
    const hideAbilityForm = (e) => {
      handleDeleteClose(e);
      e.visible = false;

   
      let loopData = [];
  
      for (let j = 0; j < abilitiesState.abilitiesList.length; j++) {
        if (abilitiesState.abilitiesList[j].arraynum === e.arraynum) {
          loopData.push(e);
        } else {
          loopData.push(abilitiesState.abilitiesList[j]);
        }
      }
      setAbilities({
        ...abilitiesState,
        abilitiesList: loopData
      });

      let newItemData = itemData;
      newItemData.fields.Special_Skills = loopData;

      setItemData({
        ...itemData,
        fields: newItemData.fields
      });
    
     loopData = [];
  
      for (let k = 0; k < abilitesFormsState.abilitiesFormList.length; k++) {
        if (k === e.arraynum) {
          const newdata = JSON.parse(
            JSON.stringify({
              visible: false,
              arraynum: k,
              Special: {
                Name: abilitesFormsState.abilitiesFormList[k].Name,
                Cost: abilitesFormsState.abilitiesFormList[k].Cost,
                Rank: abilitesFormsState.abilitiesFormList[k].Rank,
                Description: abilitesFormsState.abilitiesFormList[k].Description
              }
            })
          );
          loopData.push(newdata);
        } else {
          loopData.push(abilitesFormsState.abilitiesFormList[k]);
        }
      }
      setAbilitesForms({
        ...abilitesFormsState,
        abilitiesFormList: loopData
      });
    }


    const hideAbilityBackForm = (e) => {
      handleDeleteClose(e);
      e.visible = false;

      let loopData = [];
  
      for (let j = 0; j < abilitiesState.abilitiesListBack.length; j++) {
        if (abilitiesState.abilitiesListBack[j].arraynum === e.arraynum) {
          loopData.push(e);
        } else {
          loopData.push(abilitiesState.abilitiesListBack[j]);
        }
      }
      setAbilities({
        ...abilitiesState,
        abilitiesListBack: loopData
      });

      let newItemData = itemData;
      newItemData.back.fields.Special_Skills = loopData;

      setItemData({
        ...itemData,
        back: newItemData.back
      });
    
     loopData = [];
      for (let k = 0; k < abilitesFormsState.abilitiesListBack.length; k++) {
        if (k === e.arraynum) {
          const newdata = JSON.parse(
            JSON.stringify({
              visible: false,
              arraynum: k,
              Special: {
                Name: abilitesFormsState.abilitiesListBack[k].Name,
                Cost: abilitesFormsState.abilitiesListBack[k].Cost,
                Rank: abilitesFormsState.abilitiesListBack[k].Rank,
                Description: abilitesFormsState.abilitiesListBack[k].Description
              }
            })
          );
          loopData.push(newdata);
        } else {
          loopData.push(abilitesFormsState.abilitiesListBack[k]);
        }
      }
      setAbilitesForms({
        ...abilitesFormsState,
        abilitiesListBack: loopData
      });
    
    }
  
    const updateAbilityForms = (rank, fieldname, value) => {

      let ability = {
        arraynum: rank,
        visible: true,
          Name: '',
          Cost: null,
          Rank: null,
          Description: '',
          Tags: []
      }

      let found = false;
      for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
        if (j === rank) {
          found = true;
          ability = abilitesFormsState.abilitiesFormList[j];
        } 
      }

      ability[fieldname] = value;

  
      const loopData = [];
      const itemformData = [];
  
      for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
        if (j === rank) {
          loopData.push(ability);
          itemformData.push(ability);
          found = true;
        } else {
          loopData.push(abilitesFormsState.abilitiesFormList[j]);
          itemformData.push(abilitesFormsState.abilitiesFormList[j]);
        }
      }
  
      if (!found) {
        loopData.push(ability);
        itemformData.push(ability);
      }
  
      setAbilitesForms({
        ...abilitesFormsState,
        abilitiesFormList: loopData
      });
      setAbilities({
        ...abilitiesState,
        abilitiesList: loopData
      });

      let feilds = itemData.fields;
      feilds.Special_Skills=itemformData;

      setItemData({
        ...itemData,
        fields: feilds
      });
    }


    const updateAbilityBackForms = (rank, fieldname, value) =>{

      let ability = {
        arraynum: rank,
        visible: true,
          Name: '',
          Cost: null,
          Rank: null,
          Description: '',
          Tags: []
      }

      let found = false;
      for (let j = 0; j < abilitesBackFormsState.abilitiesFormList.length; j++) {
        if (j === rank) {
          found = true;
          ability = abilitesBackFormsState.abilitiesFormList[j];
        } 
      }

      ability[fieldname] = value;

  
      const loopData = [];
      const itemformData = [];
  
      for (let j = 0; j < abilitesBackFormsState.abilitiesFormList.length; j++) {
        if (j === rank) {
          loopData.push(ability);
          itemformData.push(ability);
          found = true;
        } else {
          loopData.push(abilitesBackFormsState.abilitiesFormList[j]);
          itemformData.push(abilitesBackFormsState.abilitiesFormList[j]);
        }
      }
  
      if (!found) {
        loopData.push(ability);
        itemformData.push(ability);
      }
  
      setAbilitesBackForms({
        ...abilitesBackFormsState,
        abilitiesFormList: loopData
      });
      setAbilities({
        ...abilitiesState,
        abilitiesListBack: loopData
      });

      let back = itemData.back;
      back.fields.Special_Skills=itemformData;

      setItemData({
        ...itemData,
        back: back
      });
    }

    const setImageData = async (e) => {
      setFinalImage(e);
      if (e.Blob != null) {
        const arr = e.Blob.split(',');
        await setItemData({
          ...itemData,
          imagedata: arr[1]
        });
    }
    }

    return (
        <>
        <div className="entryForm">
            <Form ref={formRef}>
              <FormGroup>
                <div className="input-pair">
                <FormLabel>Item Image</FormLabel>
                  <PhotoCropper description={'Item '} width={4.9} length={3} ReturnImage={(e) => setImageData(e)}  />
                  <div className='image-note'><b>Note:</b> Please keep images to no more than 400px in width.</div>
                </div>
              <div>
                Current Item Preview 
                <Item item={itemData}/>
              </div>
                    <div className='input-pair'>
                      <FormLabel>Series</FormLabel>
                      <Autocomplete
                        id="select-series-tags"
                        options={props.seriesList}
                        getOptionLabel={(option) => option.title}
                        onChange={(_, val) => upDateSeries(val)}
                        isOptionEqualToValue={(option, value) => option.guid === value.guid}
                        renderInput={(params) => <TextField placeholder="Choose Series" {...params} />}
                        defaultValue={ props.initForm !== undefined &&
                        props.initForm !== null && props.initForm.showResult === true
                            ? {
                              guid: props.initForm.apiMessage.seriesguid,
                              title: props.initForm.apiMessage.series
                            }
                            : {
                              guid: '045a829c-8cff-11ea-99f9-4371def66a6d',
                              title: '',                        
                             titlejpn: ''
                            }
                        }
                      />
                    </div>
                    {props.formJSON.map((section) => (
                      <>
                      {section.Types.some(type => type === 'All' || type === selectedOption) 
                      && (section.IsdoubleSide === null || IsdoubleSide === section.IsdoubleSide)  ? 
                      <>
                        { section.Heading !== "General"
                          ? <header key={section.Heading} className="header">{section.Heading}</header>
                          : <></>
                        }
                        {section.Values.map((item) => (
                          <> 
                          {
                               item.Type === 'TextField' && 
                               (item.Types.some(type => type === 'All' || type === selectedOption))
                                ? (<>
                                 <div key={item.Label} 
                                  className={item.Label !== "Character Bio" ? "input-pair" : "input-pair full-width"}>
                                    <FormLabel  className={item.ToolTip !== undefined 
                                      && item.ToolTip !== null ? "has-tooltip":""} 
                                      title={item.ToolTip}>{item.Label} </FormLabel>
                                    {item.Limit !== undefined 
                                    && item.Limit !== null 
                                    && formdata !== null 
                                    && formdata[item.Name] !== undefined 
                                    && formdata[item.Name] !== null 
                                    && formdata[item.Name].length > 0 ? 
                                     <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {
                                        formdata !== null 
                                        && formdata[item.Name] !== undefined ?
                                        item.Limit - formdata[item.Name].length : item.Limit} Characters Remaining</Box>
                                    : <></>  }

                      <TextField multiline rows={6} 
                      variant="standard"
                      type="input"
                      id={item.Name}
                      name={item.Name}
                      key={item.Label} 
                      {...register(item.Name)}
                      defaultValue={
                        props.initForm !== null && 
                        props.initForm.showResult === true &&
                        props.initForm.apiMessage !== null &&
                        props.initForm.apiMessage.fields[item.Name] !==
                          undefined
                          ? 
                          props.initForm.apiMessage.fields[item.Name] 
                          : item.Name === 'Name' && props.initForm.apiMessage !== null ?
                          props.initForm.apiMessage.name
                          :  props.initForm !== null && 
                          props.initForm.showResult === true &&
                          props.initForm.apiMessage !== null && item.Name === 'Description2ndSide'
                          ? props.initForm.apiMessage.back.fields.Description : ''
                      }
                       onChange={(e) => updateValue(e)}
                    />
                                  </div>
                                </>) : <></>
                          }
                            {
                            
                            item.Type === 'Input' && 
                            (item.Types.some(type => type === 'All' || type === selectedOption))
                              ? ( 
                                <>
                                  <div key={item.Label} 
                                  className={item.Label !== "Character Bio" ? "input-pair" : "input-pair full-width"}>
                                    <FormLabel  className={item.ToolTip !== undefined 
                                      && item.ToolTip !== null ? "has-tooltip":""} 
                                      title={item.ToolTip}>{item.Label} </FormLabel>
                                    {item.Limit !== undefined 
                                    && item.Limit !== null 
                                    && formdata !== null 
                                    && formdata[item.Name] !== undefined 
                                    && formdata[item.Name] !== null 
                                    && formdata[item.Name].length > 0 ? 
                                     <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {
                                        formdata !== null 
                                        && formdata[item.Name] !== undefined ?
                                        item.Limit - formdata[item.Name].length : item.Limit} Characters Remaining</Box>
                                    : <></>  }
                                    <Input 
                                    key={item.Label} 
                                    label={item.Label} 
                                    variant="standard" 
                                    type="input" id={item.Name} 
                                    inputProps={
                                    item.Limit !== undefined 
                                    && item.Limit !== null 
                                    ? { maxLength: item.Limit } : {}}
                                      {...register(item.Name)}
                                      defaultValue={
                                        props.initForm !== null && 
                                        props.initForm.showResult === true &&
                                        props.initForm.apiMessage !== null &&
                                        props.initForm.apiMessage.fields[item.Name] !==
                                          undefined
                                          ? props.initForm.apiMessage.fields[item.Name] 
                                          : item.Name === 'Name' && props.initForm.apiMessage !== null ?
                                          props.initForm.apiMessage.name
                                          : ''
                                      }
                                      onChange={(e) => updateValue(e)}
                                    />
                                  </div>
                                </>
                              )
                              : ( <></> )
                            }
                         {item.Type === 'Dropdown' && 
                         (item.Types.some(type => type === 'All' || type === selectedOption))
                              ? ( 
                                <>
                                  <div className={item.Label !== "Character Bio" ? "input-pair" : "input-pair full-width"}>
                                    <FormLabel  className={item.ToolTip !== undefined && item.ToolTip !== null ? "has-tooltip":""} title={item.ToolTip}>{item.Label} </FormLabel>
                                    {item.Limit !== undefined 
                                    && item.Limit !== null && formdata !== null && formdata !== undefined
                                    && formdata[item.Name] !== undefined && formdata[item.Name] !== null && formdata[item.Name].length > 0 ? 
                                     <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {item.Limit - formdata[item.Name].length} Characters Remaining</Box>
                                    : <></>  }
                                    <Select 
                                       key={item.Label} 
                                       label={item.Label} 
                                       variant="standard" 
                                       type="input" 
                                       id={item.Name} 
                                        {...register(item.Name)}
                                        defaultValue={
                                        props.initForm !== null && 
                                        props.initForm.showResult === true &&
                                        props.initForm.apiMessage !== null &&
                                        props.initForm.apiMessage.fields[item.Name] !==
                                          undefined
                                          ? props.initForm.apiMessage.fields[item.Name]
                                          : ''
                                      }
                                      onChange={(e) => updateValue(e)}
                                    > 
                                    {item.enums.map((enumval) => (
                                        <MenuItem key={enumval} value={enumval}>{enumval}</MenuItem>
                                    ))}
                                    </Select>
                                  </div>
                                </>
                              )
                              : ( <></> )
                            }
                          {
                          item.Type === 'MultiInput'  && 
                          (item.Types.some(type => type === 'All' || type === selectedOption))
                            ? (
                              <>
                                <div className="input-pair">
                                  <FormLabel>{item.Label}</FormLabel>
                                  <MultiTextField
                                    fieldsState={{
                                      fieldname: item.Name,
                                      fieldlabel: item.Label,
                                      fieldValues: []
                                    }}
                                    updateMultiText={(e) => updateMultiValue(e)}
                                    {...register(item.Name)}
                                    defaultValue={
                                      props.initForm !== null && 
                                      props.initForm.showResult === true &&
                                      props.initForm.apiMessage !== null
                                        ? props.initForm.apiMessage.fields[item.Name]
                                        : []
                                    }
                                  />
                                </div>
                              </>
                            )
                            : ( <></> )}
    
                            {
                            item.Type === 'Checkbox'  && 
                            (item.Types.some(type => type === 'All' || type === selectedOption))
                            ? (
                              <>
                                <div className="input-pair">
                                <FormControlLabel control={<Checkbox {...register(item.Name)} 
                                onChange={(e, i) => updateValue(e, i)} 
                                  defaultChecked={
                                    props.initForm !== null && 
                                    props.initForm.showResult === true && 
                                    props.initForm.apiMessage !== null &&
                                    props.initForm.apiMessage[item.Name] !== undefined
                                    && props.initForm.apiMessage[item.Name] !== null
                                   ? props.initForm.apiMessage[item.Name]
                                    : props.initForm !== null && 
                                    props.initForm.showResult === true && 
                                    props.initForm.apiMessage !== null &&
                                    props.initForm.apiMessage.fields[item.Name] !== undefined
                                    && props.initForm.apiMessage.fields[item.Name] !== null
                                    ? props.initForm.apiMessage.fields[item.Name]
                                    : false
                               } />}
                                  label={item.Label}
                                />
                                </div>
                              </>
                            )
                            : ( <></> )}

                      {item.Type === 'SpecialSkillsInput'  
                      && item.Types.some(type => type === 'All' || type === selectedOption) ?
                      <div className='character-sheet-powers'>
                        { item.Name === 'Special_Skills'  ?
                        abilitiesState.abilitiesList.map((ability) => (
                          <ItemAbilites
                            abilityListName={item.Name}
                            itemTags={props.tagslist.abilityTags}
                            key={ability.arraynum}
                            abilityState={ability}
                            hideAbility={hideAbilityForm}
                            onFillIn={(rank, fieldname, value) => updateAbilityForms(rank, fieldname, value)}
                            SetAbilityValue={updateValue}
                          />
                        )) :
                        abilitiesState.abilitiesListBack.map((ability) => (
                          <ItemAbilites
                            abilityListName={item.Name}
                            itemTags={props.tagslist.abilityTags}
                            key={ability.arraynum}
                            abilityState={ability}
                            hideAbility={hideAbilityBackForm}
                            onFillIn={(rank, fieldname, value) => updateAbilityBackForms(rank, fieldname, value)}
                            SetAbilityValue={updateValue}
                          />
                        ))
                        }
                        <button className="button-action add-another-ability" onClick={(e) => addAbilityForm(e, item.Name)}>Add Another Ability</button>
                      </div>
                      : <></>
                        }

                          </>
                      ))}
      </> 
      : <></>}</> 
                    ))}

                      <div className="character-items-tags">
                        <div className='input-pair'>
                          <FormLabel>Item Tags</FormLabel>
                          <Autocomplete
                            id="select-tags"
                            multiple
                            defaultValue={
                              props.initForm.showResult === true
                                ? props.initForm.apiMessage.tags
                                : []
                            }
                            value={tagState.listElements}
                            options={props.tagslist.characterTags}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, val) => upDateTags(val)}
                            renderInput={(params) => (
                              <TextField {...params} placeholder="choose tags" />
                            )}
                          />
                        </div>
                        
                      </div>
          
              </FormGroup>
        </Form>
        </div>
        <div>
        <FormControlLabel control={<Checkbox 
                                onChange={()  => ToggleDoubleSide()} 
                                  defaultChecked={  props.initForm !== undefined &&
                                    props.initForm !== null && 
                                    props.initForm.showResult === true ? props.initForm.apiMessage.isdoubleside  : false } />}
                                label='Is Double Sided'
                                />

        </div>
        <div className="character-sheet-gm-notes">
                  <div className='input-pair'>
                    <FormLabel className="has-tooltip" title="These are notes to other GMs that will allow them to better understand this item and how it can work within a LARP. Provide potential warnings or more detail to specific powers, connections to other characters or items, etc. These notes will automatically be printed as a separate page from the character sheet. Only add notes when they are truly necessary.">
                      GM Notes about This Item:
                    </FormLabel>
                    <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {4898 - gmNotes.length} Characters Remaining</Box>
                    <TextField multiline rows={6} 
                      variant="standard"
                      type="input"
                      inputProps={{maxLength: 4898}}
                      id={'GMNotes'}
                      defaultValue={
                        props.initForm.showResult === true
                          ? gmNotes
                          : null
                      }
                      onChange={(e) => setGMNotes(e.target.value)}
                    />
                  </div>
                </div>

        <div className="edit-bottom">
                      <button className="button-cancel" onClick={() => props.GoBack(false)}>Cancel</button>
                      <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Submit Changes</button>
                      {props.initForm.showResult && props.initForm.apiMessage.secondapprovalbyuserGuid === null &&
                      props.currenUserGuid !== props.initForm.apiMessage.firstapprovalbyuserGuid &&
                        props.currenUserGuid !== props.initForm.apiMessage.editbyUserGuid  ?
                      <button className="button-action" onClick={() => props.Approve()}>Approve Item</button>
            :<></>}
        </div>
        </>
    )
}

export default ItemEditForm;

ItemEditForm.propTypes = {
  formJSON: PropTypes.array,
  tagslist: PropTypes.object,
  itemList: PropTypes.object,
  itemTags: PropTypes.array,
  Submit: PropTypes.func,
  FetchPopoverItem: PropTypes.func,
  showResult: PropTypes.bool,
  initForm: PropTypes.object,
  apiMessage: PropTypes.object,
  ReturnItem: PropTypes.func,
  GoBack: PropTypes.func,
  SubmitForm: PropTypes.func,
  Approve: PropTypes.func,
  seriesList: PropTypes.array,
  data: PropTypes.object,
  currenUserGuid: PropTypes.string
}


