import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import formJSON from '../../jsonfiles/characterinput.json';
import { Form, FormGroup } from 'reactstrap';
import ItemAbilites from '../specialskills/ItemAbilites';
import MultiTextField from '../inputs/multitextfield';
import { v4 } from 'uuid';
import {
  Autocomplete, TextField,
  FormControlLabel, FormLabel, Input, Dialog, DialogTitle, 
  IconButton, DialogContent, Typography, DialogActions, Button, Box, Checkbox, Drawer
} from '@mui/material';
import Loading from '../../components/loading/loading';
import { green } from '@mui/material/colors';
import ReviewNotesDisplay from '../reviewnotes/reviewnotesdisplay';
import ReviewNotesForm from '../reviewnotes/reviewnotesform';
import PhotoCropper from '../photocropper/photocropper';
import ItemSelector from '../itemselector/itemselector';
import Character from '../character/character';
import { characterDataProcess } from '../../utils/characterdataprocess';
import useGetData from '../../utils/getdata';

const CharacterEditForm = (props) => {
  const { register, handleSubmit, getValues, setValue } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onBlur'
  });

  const handleFormSubmit = async (data) => {
    var form = document.querySelector("form");
    if (form.reportValidity()) { SubmitForm(data);}
  };

  //const handleFormSubmit = (data) => SubmitForm(data);
  const [JSONData, setJSONData] = useState([]);
  const [gmNotes, setGMNotes] = useState('');
  const [imageState, setImageState] = useState({
    imagedata1: null,
    imagedata2: null
  });

  const [tagState, setTagState] = useState({
    showResult: false,
    apiMessage: [],
    listTags: [],
    taglocation: -1
  });

  const [abilitiesState, setAbilities] = useState({
    abilitiesList: JSON.parse(JSON.stringify([{ arraynum: 0, visible: true }])),
    showResult: true
  });

  const [abilitesFormsState, setAbilitesForms] = useState({
    abilitiesFormList: JSON.parse(
      JSON.stringify([{ arraynum: 0, visible: false }])
    ),
    showResult: true
  });

  const [selectedSeries, setSelectedSeries] = useState({
    guid:'045a829c-8cff-11ea-99f9-4371def66a6d',
    series: {
        guid: '045a829c-8cff-11ea-99f9-4371def66a6d',
        title: '',                        
        titlejpn: ''
      }
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

  const [itemsState, setItemsState] = useState({
    selectedApproved: true,
    commentFilter: false,
    showApprovableOnly: false,
    viewingItem: false,
    viewItemGuid: '',
    viewItemPath: ''
});

  const [reviewsState, setReviewsState] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(
    {open:false,
    row:null});

  const ToggleItemPicker = (label, e) => {
    e.preventDefault();
    const show = !itemsTableState.show;
    setItemsTableState({
      ...itemsTableState,
      show,
      label
    });
  }

  const UpdateItemList = async (e) => {

    if (itemsTableState.label === 'Sheet Item') {
        if (e.length > 0) {
            setItemsTableState({
              ...itemsTableState,
              sheetItemGuid: e[0].guid,
              sheetItem: e[0].name
            });
        }
        else {
            setItemsTableState({
                ...itemsTableState,
                sheetItemGuid: null,
                sheetItem: null,
                sheetItemFullItem: [null]
              });
        }
    } 
    else {
        const startingItemList = [];
        const startingGuidList = [];

        e.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                startingItemList.push(item.name);
                startingGuidList.push(item.guid);
              } 
        })
        setItemsTableState({
            ...itemsTableState,
            startingItemGuids: startingGuidList,
            startingItems: startingItemList
          });
    }
  }


  const SubmitForm = (formdata) => {

    let skillData = [];

    for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
      if (abilitesFormsState.abilitiesFormList[j] != null) {
        if (abilitesFormsState.abilitiesFormList[j].visible) {
          skillData.push(abilitesFormsState.abilitiesFormList[j]);
        }
      }
    }

    if (!skillData.length || !skillData) {
      skillData = null;
    }

    let bstr = '';
    if (finalImage != null) {
      const arr = finalImage.Blob.split(',');
      bstr = arr[1];
    }

    let bstr2 = '';
    if (finalImage2 != null) {
      const arr2 = finalImage2.Blob.split(',');
      bstr2 = arr2[1];
    }

    const fields = {
      ...formdata,
      Special_Skills: skillData,
      Tags: tagState.listTags,
      Starting_Items: itemsTableState.startingItemGuids,
      Sheet_Item: itemsTableState.sheetItemGuid
    }
 
    let newGuid = v4();
    const allData = {
      guid: props.initForm.apiMessage !== undefined && props.initForm.apiMessage !== null ?
       props.initForm.apiMessage.guid : newGuid,
      Seriesguid: selectedSeries.guid,
      name: formdata.Name,
      imagedata1: bstr,
      imagedata2: bstr2,
      img1: props.initForm.apiMessage !== undefined && props.initForm.apiMessage !== null ?
      props.initForm.apiMessage.guid + '.jpg' :newGuid + '.jpg' ,
      img2: props.initForm.apiMessage !== undefined && props.initForm.apiMessage !== null ? 
      props.initForm.apiMessage.guid + '_2.jpg' :newGuid + '_2.jpg' ,
      fields,
      gmnotes: gmNotes,
      readyforapproval: fields.readyforapproval
    }
    props.Submit(allData);
  }


  const [imageSrc] = useState(null);
  const [imageSrc2] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [finalImage2, setFinalImage2] = useState(null);
  const [formdata, setFormdata] = useState(null);
  const [open, setOpen] = useState(false);


  const togglePreview = (e) => {
    setOpen(e);
  };


  const upDateSeries = (e) => {
    if (e === null) {
      setSelectedSeries({
        guid:'045a829c-8cff-11ea-99f9-4371def66a6d',
        series: {
            guid: '045a829c-8cff-11ea-99f9-4371def66a6d',
            title: '',                        
            titlejpn: ''
          }
    });
      return;
    }
    setSelectedSeries({
        ...selectedSeries,
        guid: e.guid,
        series: e});
  }

  useEffect(() => {
    initForm(props.formJSON);
  }, [])

  const initForm = async (formJSON) => {
    const formData = [];

    for (const key of Object.keys(formJSON)) {
      const sectionData = [];
      for (const subkey of Object.keys(formJSON[key].Values)) {
        const jsonItem = {
          Label: formJSON[key].Values[subkey].Label,
          Type: formJSON[key].Values[subkey].Type,
          ToolTip: formJSON[key].Values[subkey].ToolTip,
          Name: formJSON[key].Values[subkey].Name,
          Limit: formJSON[key].Values[subkey].Limit,
        }
        sectionData.push(jsonItem);
      }
      const section = {
        Heading: formJSON[key].Heading,
        Values: sectionData
      }
      formData.push(section);
    }
    await setJSONData(formData);

    const loopData = [];
    const loopDataWithNulls = [];

    if (props.initForm.showResult) {
      setFinalImage({
        Blob:'data:image/png;base64,' + props.initForm.apiMessage.imagedata1
      }
      )
      setFinalImage2({
        Blob:'data:image/png;base64,' + props.initForm.apiMessage.imagedata2
      }
      )
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
                Tags: oldTags,
                initialTags: initial

            })
          )
          loopDataWithNulls.push(newData);
        }
      }
      const sheetItemList = [props.initForm.apiMessage.sheet_Item];
      const startItemList = [];
      const startItemGuidList = [];
      props.initForm.apiMessage.starting_Items.forEach((item) => {
        if (item.issheetitem !== true)
        {
        sheetItemList.push();
        startItemList.push(item.name);
        startItemGuidList.push(item.guid);
        }
      })
      await setSelectedSeries({ 
        ...selectedSeries,
        guid: props.initForm.apiMessage.seriesguid});
    let sheetItemGuid = null;
    let sheetItemName = null;
    if (props.initForm.apiMessage.sheet_Item !== undefined && props.initForm.apiMessage.sheet_Item !== null){
        sheetItemGuid = props.initForm.apiMessage.sheet_Item.guid;
        sheetItemName = props.initForm.apiMessage.sheet_Item.name;
    }

    let i = 0;
    let j = 0;
    let fullListOrdered = []
    fullListOrdered.push([]);


    while (i < props.initForm.apiMessage.starting_Items.length) {
      fullListOrdered[j].push(props.initForm.apiMessage.starting_Items[i]);
      if (fullListOrdered[j].length === 9) {
        fullListOrdered.push([]);
        j++;
      }
      i++;
    }

      await setItemsTableState({
        ...itemsTableState,
        sheetItemGuid: sheetItemGuid,
        sheetItem: sheetItemName,
        sheetItemFullItem: sheetItemList,
        startingItems: startItemList,
        startingItemGuids: startItemGuidList,
        startingItemFullItems: fullListOrdered,
        isMounted: true
      });
      upDateTags(props.initForm.apiMessage.tags);
    } else {
      await setItemsTableState({
        ...itemsTableState,
        isMounted: true
      });
    }
    if (props.initForm.apiMessage !== null) {
      setReviewsState(props.initForm.apiMessage.reviewMessages);
    }
    setAbilitesForms({
      ...abilitesFormsState,
      abilitiesFormList: loopDataWithNulls
    });
    setAbilities({
      ...abilitiesState,
      abilitiesList: loopData
    });
    if (props.initForm.apiMessage !== undefined && props.initForm.apiMessage !== null) {
    setGMNotes(props.initForm.apiMessage.gmnotes);
    }
    else {
      setGMNotes('');
    }
  }

  const RemoveReview = (id) => {
    const newReviewList = [];
    reviewsState.forEach(element => {
      if (element.id !== id) {
        newReviewList.push(element);
      }
    });
    setReviewsState(newReviewList);
  }

  const AddReview =(message) => {
    const newReviewList = [];
    newReviewList.push({
      createdate: '2024-01-28T22:18:41.687672',
      createdby: 'Wizard',
createdbyuserGuid: 'c3b9af32-8676-11ed-b512-df76a0797704',
id: 1,
isActive: true,
message: message,
isNew: true
    });
    setReviewsState(newReviewList);
  }

  const updateValue = (e, i) => {
    if (i !== true && i !== false) {
    setValue(e.target.name, e.target.value);
    setFormdata({
      ...formdata,
      [e.target.name]: e.target.value});
    }
    else {
      setValue(e.target.name, i);
      setFormdata({
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
    setFormdata({
        ...formdata,
        [e.fieldname]: allvals})
  }

  const upDateTags = (e) => {
    const listguids = [];
    const listtags = [];
    e.forEach((element) => {
      listguids.push(element.guid);
      listtags.push(element)
    })
    setTagState({
      ...tagState,
      listTags: listguids,
      tags: listtags
    });
  }

  const addAbilityForm = (e) => {
    e.preventDefault();
    const i = abilitiesState.abilitiesList.length;
    const newform = JSON.parse(JSON.stringify({ arraynum: i, visible: true }));
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

  const handleDeleteClose =() => {
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

    for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
      if (j === rank) {
        loopData.push(ability);
        found = true;
      } else {
        loopData.push(abilitesFormsState.abilitiesFormList[j]);
      }
    }

    if (!found) {
      loopData.push(ability);
    }

    setAbilitesForms({
      ...abilitesFormsState,
      abilitiesFormList: loopData
    });
    setAbilities({
      ...abilitiesState,
      abilitiesList: loopData
    });
  }

  const ToggleItemSwitch = async (e) => {
    let toggled=itemsState[e];

    if (e === 'selectedApproved' && itemsState.showApprovableOnly) {
      await setItemsState({
        ...itemsState,
        [e]: !toggled,
        showApprovableOnly:false
    });
    }
    else {
    await setItemsState({
        ...itemsState,
        [e]: !toggled
    });
  }
}  

  const updateImageData = async (imagename, e) => {
    if (imagename === '1') 
    {
        setFinalImage(e);
        if (e.Blob != null) {
            const arr = e.Blob.split(',');
            await setImageState({
              ...imageState,
              imagedata1: arr[1]
            });
        }
    }
    else 
    {
        setFinalImage2(e);
        if (e.Blob != null) {
            const arr = e.Blob.split(',');
            await setImageState({
              ...imageState,
              imagedata2: arr[1]
            });
        }
    }
  }

  const BackFromItemSelector = async () => {
    await setItemsTableState({
        ...itemsTableState,
        show: false
      });
  }

  if (JSONData.length === 0 || !itemsTableState.isMounted) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    if (!itemsTableState.show) {
      return (
        <>
          <div className="character-sheet-form">
            <div className='character-sheet-images'>
              <div className='input-pair'>
                <FormLabel>Character Headshot Image</FormLabel>
                {imageSrc
                  ? (
                    <React.Fragment></React.Fragment>
                  )
                  : ( 
                    <>
                       <PhotoCropper description={''} width={4.5} length={3} ReturnImage={(e) => updateImageData('1', e)}  />
                      <div className='image-note'><b>Note:</b> Please keep headshot images to no more than 400px in width.</div>
                    </>
                  )}
              </div>
              <div className='input-pair'>
                <FormLabel>Character Full Body Image</FormLabel>
                {imageSrc2
                  ? (
                    <React.Fragment></React.Fragment>
                  )
                  : ( 
                    <>
                      <PhotoCropper description={''} width={1} length={2} ReturnImage={(e) => updateImageData('2',e)}  />
                      <div className='image-note'><b>Note:</b> Please keep headshot images to no more than 275px wide and 550px tall.</div>
                    </>
                  )
                }
              </div>
              <div className='input-pair'>
                <FormLabel>Current Headshot Image</FormLabel>
                {finalImage?.Blob
                  ? (
                    <div className='character-sheet-headshot'><img src={finalImage.Blob} alt='[empty character headshot]' /></div>
                  )
                  : ( <div></div> )
                }
              </div>
              <div className='input-pair'>
                <FormLabel>Current Full Body Image</FormLabel>
                {finalImage2?.Blob
                  ? (
                    <div className='character-sheet-fullbody'><img src={finalImage2.Blob} alt='[empty character full body]' /></div>
                  )
                  : ( <div></div> )
                }
              </div>
            </div>
            
            <header className="header">General Character Info</header>
            <Form>
              <FormGroup>
                <div className='input-pair'>
                  <FormLabel>Series</FormLabel>
                  <Autocomplete
                    id="select-series-tags"
                    options={props.seriesList}
                    getOptionLabel={(option) => option.title}
                    onChange={(event, val) => upDateSeries(val)}
                    isOptionEqualToValue={(option, value) => option.guid === value.guid}
                    renderInput={(params) => <TextField placeholder="choose series" {...params} />}
                    defaultValue={
                      props.initForm.showResult === true
                        ? {
                          guid: props.initForm.apiMessage.seriesguid,
                          title: props.initForm.apiMessage.seriesTitle
                        }
                        :  selectedSeries.series !== undefined && selectedSeries.series !== null ?
                           selectedSeries.series
                        : {
                          guid: '045a829c-8cff-11ea-99f9-4371def66a6d',
                          title: '',                        
                          titlejpn: ''
                        }
                    }
                  />
                </div>
                {JSONData.map((section) => (
                  <>
                    { section.Heading !== "General"
                      ? <header className="header">{section.Heading}</header>
                      : <></>
                    }
                    {section.Values.map((item) => (
                      <> 
                        {item.Type === 'Input'
                          ? ( 
                            <>
                              <div className={item.Label !== "Character Bio" ? "input-pair" : "input-pair full-width"}>
                                <FormLabel  className={item.ToolTip !== undefined && item.ToolTip !== null ? "has-tooltip":""} title={item.ToolTip}>{item.Label} </FormLabel>
                                {item.Limit !== undefined 
                                && item.Limit !== null && formdata !== null 
                                && formdata[item.Name] !== undefined && formdata[item.Name] !== null && formdata[item.Name].length > 0 ? 
                                 <Box sx={{ color: green, display: 'inline', fontSize: 14 }}> {item.Limit - formdata[item.Name].length} Characters Remaining</Box>
                                : <></>  }
                                <Input key={item.Label} label={item.Label} variant="standard" type="input" id={item.Name} inputProps={item.Limit !== undefined 
                                && item.Limit !== null ? { maxLength: item.Limit } : {}}
                                  {...register(item.Name)}
                                  defaultValue={
                                    props.initForm.showResult === true &&
                                    props.initForm.apiMessage.fields[item.Name] !==
                                      undefined
                                      ? props.initForm.apiMessage.fields[item.Name]
                                      : ''
                                  }
                                  onChange={(e) => updateValue(e)}
                                />
                              </div>
                            </>
                          )
                          : ( <></> )
                        }
                      {item.Type === 'MultiInput'
                        ? (
                          <>
                            <div className="input-pair">
                              <FormLabel>{item.Label}</FormLabel>
                              <MultiTextField
                                fieldsState={{
                                  fieldname: item.Name,
                                  fieldlabel: item.Label,
                                  fieldValues: formdata !== undefined && formdata !== null 
                                  && formdata[item.Name] !== undefined && formdata[item.Name] !== null ?
                                  formdata[item.Name] :
                                []
                                }}
                                updateMultiText={(e) => updateMultiValue(e)}
                                {...register(item.Name)}
                                defaultValue={
                                  props.initForm.showResult === true
                                    ? props.initForm.apiMessage.fields[item.Name] 
                                    : []
                                }
                              />
                            </div>
                          </>
                        )
                        : ( <></> )}

                        {item.Type === 'Checkbox'
                        ? (
                          <>
                            <div className="input-pair">
                            <FormControlLabel control={<Checkbox {...register(item.Name)} onChange={(e, i) => updateValue(e, i)} 
                              defaultChecked={props.initForm.showResult === true && props.initForm.apiMessage[item.Name] !== undefined
                                && props.initForm.apiMessage[item.Name] !== null
                               ? props.initForm.apiMessage[item.Name]
                                : false
                           } />}
                              label={item.Label}
                            />
                            </div>
                          </>
                        )
                        : ( <></> )}
                      </>
                    ))}
                  </>
                ))}

                  <div className='character-sheet-powers'>
                    <header className="header">Character Powers</header>
                    {abilitiesState.abilitiesList.map((ability) => (
                      <ItemAbilites
                        itemTags={props.tagslist.abilityTags}
                        key={ability.arraynum}
                        abilityState={ability}
                        hideAbility={hideAbilityForm}
                        onFillIn={(rank, fieldname, value) => updateAbilityForms(rank, fieldname, value)}
                        SetAbilityValue={updateValue}
                      />
                      
                    ))}
                    <button className="button-action add-another-ability" onClick={(e) => addAbilityForm(e)}>Add Another Ability</button>
                  </div>
                  
                  <div className="character-items-tags">
                    <div className='input-pair'>
                      <FormLabel>Sheet Item</FormLabel>
                      <TextField placeholder="no item chosen yet" disabled={true} defaultValue={itemsTableState.sheetItem} />
                      <button className="button-action addremove-sheet-item" onClick={(e) => ToggleItemPicker('Sheet Item', e)}>Add/Remove Sheet Item</button>
                    </div>
                    <div className='input-pair'>
                      <FormLabel>Starting Items</FormLabel>
                      <TextField placeholder="no items chosen yet" disabled={true} defaultValue={itemsTableState.startingItems.join(', ')} />
                      <button className="button-action addremove-sheet-item" onClick={(e) => ToggleItemPicker('Starting Items', e)}>Add/Remove Starting Items</button>
                    </div>
                    <div className='input-pair'>
                      <FormLabel>Character Tags</FormLabel>
                      <Autocomplete
                        id="select-tags"
                        multiple
                        defaultValue={
                          props.initForm.showResult === true
                            ? props.initForm.apiMessage.tags 
                            : tagState.listTags !== null && tagState.listTags.length > 0 ?
                              tagState.tags :
                            []
                        }
                        options={props.tagslist.itemTags}
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

            <div className="character-sheet-gm-notes">
              <div className='input-pair'>
                <FormLabel className="has-tooltip" title="These are notes to other GMs that will allow them to better understand this sheet and how this character can work within a LARP. Provide potential warnings or more detail to specific powers, connections to other characters or items, etc. These notes will automatically be printed as a separate page from the character sheet. Only add notes when they are truly necessary.">
                  GM Notes about This Character:
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
          <div>
              
              {reviewsState.length > 0 ?
              reviewsState.map(message => 
                <ReviewNotesDisplay key={message} message={message} RemoveReview={(id) => RemoveReview(id)} />)
                : <ReviewNotesForm  AddReview={(e) => AddReview(e)} type={'Character'} />
              }
              <div>
            {'&nbsp'}
            </div>
            <div>
            {'&nbsp'}
            </div>
          </div>

          
          <div className="edit-bottom">
            <button className="button-cancel" onClick={() => props.GoBack()}>Cancel</button>
            <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Save Sheet</button>
            <button className="button-action" onClick={() => togglePreview(true)}>Preview</button>
            {props.initForm.showResult && props.initForm.apiMessage.secondapprovalbyUserGuid === null
            && props.authLevel > 2 && props.currenUserGuid !== props.initForm.apiMessage.firstapprovalbyuserGuid &&
            props.currenUserGuid !== props.initForm.apiMessage.editbyUserGuid 
            ?
            <button className="button-action" onClick={() => props.Approve()}>Approve Sheet</button>
            :<></>}
          </div>

          <Drawer PaperProps={{
            sx: { width: "90%" }}} open={open} onClose={() => togglePreview(false)}>
             <Box sx={{ width: "95%" }} role="presentation" onClick={() => togglePreview(false)}>
               <Character id="character" formJSON={formJSON} 
               character={characterDataProcess(abilitesFormsState, finalImage,  finalImage2, 
                formdata, tagState, itemsTableState, 
                props.initForm.apiMessage !== undefined ? props.initForm.apiMessage : null
                , selectedSeries, gmNotes)} />
             </Box>
          </Drawer>

          
        {deleteDialogOpen.row !== null
          ? <Dialog
              onClose={() => handleDeleteClose()}
              aria-labelledby="customized-dialog-title"
              open={deleteDialogOpen.open}>
              <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Delete this Ability?
              </DialogTitle>
              <IconButton
                aria-label="close"
                onClick={() => handleDeleteClose()}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500]
                }}>
              </IconButton>
              <DialogContent dividers>
                <Typography gutterBottom>
                  Are you SURE you want to delete this abilty?
                  This cannot be undone, you&apos;ll have to enter it again manually.
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button autoFocus onClick={() => handleDeleteClose()}>No</Button>
                <Button onClick={() => hideAbilityForm(deleteDialogOpen.row)}>Yes</Button>
              </DialogActions>
            </Dialog>
          : <div></div>
        }




        </>
      )
    } else {
      return (
        <>   
          <ItemSelector 
          isCharSheet={true}
           appdata={props.appdata} 
           undata={props.undata} 
           larpTags={props.larpRunTags.larpRuntagsResult}
           tagslist={props.tagslist.itemTags}
           authLevel={2}
           initialItems={itemsTableState}
           userGuid={props.userGuid}
           selectedApproved={itemsState.selectedApproved} 
           commentFilterOn={itemsState.commentFilter}
           showApprovableOnly={itemsState.showApprovableOnly}
           ToggleSwitch={() => ToggleItemSwitch('selectedApproved')}
           ToggleCommentSwitch={() => ToggleItemSwitch('commentFilter')}
           ToggleApprovableSwitch={() => ToggleItemSwitch('showApprovableOnly')}
           UpdateItemList={(e) => UpdateItemList(e)}
           GoBack={() => BackFromItemSelector()}/>
        </>
      )
    }
  }
}

export default CharacterEditForm;

CharacterEditForm.propTypes = {
  authLevel: PropTypes.number,
  currenUserGuid: PropTypes.string,
  formJSON: PropTypes.array,
  tagslist: PropTypes.object,
  appdata: PropTypes.object,
  undata: PropTypes.object,
  itemTags: PropTypes.object,
  larpRunTags: PropTypes.array,
  Submit: PropTypes.func,
  FetchPopoverItem: PropTypes.func,
  userGuid: PropTypes.string,
  showResult: PropTypes.bool,
  initForm: PropTypes.object,
  apiMessage: PropTypes.object,
  ReturnItem: PropTypes.func,
  GoBack: PropTypes.func,
  Approve: PropTypes.func,
  seriesList: PropTypes.array
}