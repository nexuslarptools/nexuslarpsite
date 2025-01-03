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
  IconButton, DialogContent, Typography, DialogActions, Button, Box, Checkbox, Drawer,
  FormHelperText
} from '@mui/material';
import Loading from '../../components/loading/loading';
import { green } from '@mui/material/colors';
import ReviewNotesDisplay from '../reviewnotes/reviewnotesdisplay';
import ReviewNotesForm from '../reviewnotes/reviewnotesform';
import PhotoCropper from '../photocropper/photocropper';
import ItemSelector from '../itemselector/itemselector';
import Character from '../character/character';
import { characterDataProcess } from '../../utils/characterdataprocess';

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
  const [image1change, set1ImageChange] = useState(false);
  const [image2change, set2ImageChange] = useState(false);

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
    guid:'',
    series: {
        guid: '',
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
    startingItemFullItems: [],
    upgradeItems: [],
    upgradeItemGuids: [],
    upgradeItemFullItems: []
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
    else if (itemsTableState.label === 'Upgrade Items') {
      const upgradeItemList = [];
      const upgradeGuidList = [];

      e.forEach(item => {
          for (let i = 0; i < item.count; i++) {
            upgradeItemList.push(item.name);
            upgradeGuidList.push(item.guid);
            } 
      })
      setItemsTableState({
          ...itemsTableState,
          upgradeItemGuids: upgradeGuidList,
          upgradeItems: upgradeItemList
        });
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

    if(selectedSeries.guid === '')
    {
      return;
    }

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

    const fields = {
      ...formdata,
      Special_Skills: skillData,
      Tags: tagState.listTags,
      Starting_Items: itemsTableState.startingItemGuids,
      Upgrade_Items: itemsTableState.upgradeItemGuids,
      Sheet_Item: itemsTableState.sheetItemGuid
    }
 
    let newGuid = v4();
    const allData = {
      guid: props.initForm.apiMessage !== undefined && props.initForm.apiMessage !== null ?
      props.initForm.apiMessage.guid : newGuid,
      Seriesguid: selectedSeries.guid,
      name: formdata.Name,
      fields,
      gmnotes: gmNotes,
      readyforapproval: fields.readyforapproval
    }
    props.Submit(allData, finalImage, finalImage2, image1change, image2change);
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
        guid:'',
        series: {
            guid: '',
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
          Required: formJSON[key].Values[subkey].Required,
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
      if (!image1change) {
        setFinalImage(props.img);
      }
      if (!image2change) {
        setFinalImage2(props.img2)
      }
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
                FullTags: initial
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
                FullTags: initial

            })
          )
          loopDataWithNulls.push(newData);
        }
      }
      const sheetItemList = [props.initForm.apiMessage.sheet_Item];
      const startItemList = [];
      const upgradeItemList = [];
      const startItemGuidList = [];
      const upgradeItemGuidList = [];

      props.initForm.apiMessage.starting_Items.forEach((item) => {
        if (item.issheetitem !== true)
        {
        sheetItemList.push();
        startItemList.push(item.name);
        startItemGuidList.push(item.guid);
        }
      })
      if (props.initForm.apiMessage.upgrade_Items !== undefined && props.initForm.apiMessage.upgrade_Items !== null)
      {
      props.initForm.apiMessage.upgrade_Items.forEach((item) => {
        if (item.issheetitem !== true)
        {
        upgradeItemList.push();
        upgradeItemList.push(item.name);
        upgradeItemGuidList.push(item.guid);
        }
      })
    }
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

    if (props.initForm.apiMessage.upgrade_Items !== undefined && props.initForm.apiMessage.upgrade_Items !== null) {
    while (i < props.initForm.apiMessage.upgrade_Items.length) {
      fullListOrdered[j].push(props.initForm.apiMessage.upgrade_Items[i]);
      if (fullListOrdered[j].length === 9) {
        fullListOrdered.push([]);
        j++;
      }
      i++;
    }
  }

      await setItemsTableState({
        ...itemsTableState,
        sheetItemGuid: sheetItemGuid,
        sheetItem: sheetItemName,
        sheetItemFullItem: sheetItemList,
        startingItems: startItemList,
        startingItemGuids: startItemGuidList,
        startingItemFullItems: fullListOrdered,
        upgradeItems: upgradeItemList,
        upgradeItemGuids: upgradeItemGuidList,
        upgradeItemFullItems: fullListOrdered,
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

  const MoveAbilityDown = async (rank) => {
    if (rank !== abilitesFormsState.abilitiesFormList.length) {
      let data = [...abilitesFormsState.abilitiesFormList];
      let temp = data[rank+1];
      temp.arraynum = rank;
      temp.reinit = true;
      data[rank+1] = data[rank];
      data[rank+1].arraynum = rank + 1
      data[rank+1].reinit = true;
      data[rank] = temp; 

      await setAbilitesForms({
        ...abilitesFormsState,
        abilitiesFormList: data
      });
      await setAbilities({
        ...abilitiesState,
        abilitiesList: data
      });
    }
  }

  const MoveAbilityUp = async (rank) => {
      if (rank > 0) {
      let data = [...abilitesFormsState.abilitiesFormList];
      let temp = data[rank-1];
      temp.arraynum = rank;
      temp.reinit = true;
      data[rank-1] = data[rank];
      data[rank-1].arraynum = rank -1
      data[rank-1].reinit = true;
      data[rank] = temp;

     /*  
    let newformdata = formdata;
    formdata.fields.Special_Skills = data;

    setFormdata({
      ...formdata,
      fields: newformdata.fields
    });
 */
      await setAbilitesForms({
        ...abilitesFormsState,
        abilitiesFormList: data
      });
      await setAbilities({
        ...abilitiesState,
        abilitiesList: data
      });
    }
  }


  const AbilityInitComplete = async (e) => {
    let data = [...abilitesFormsState.abilitiesFormList];
    data[e].reinit=false;

    setAbilitesForms({
      ...abilitesFormsState,
      abilitiesFormList: data
    });
    setAbilities({
      ...abilitiesState,
      abilitiesList: data
    });
  }


  const addAbilityForm = (e) => {
    e.preventDefault();
    const i = abilitiesState.abilitiesList.length;
    const newform = JSON.parse(
      JSON.stringify(
        { arraynum: i, 
          visible: true,
          Name: '',
          Cost: null,
          Rank: null,
          Description: '',
          FullTags: [],
          Tags: [] }
        ));
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

  const hideAbilityForm = async (e) => {
    handleDeleteClose(e);
    e.visible = false;

    let loopData = [];

    for (let j = 0; j < abilitiesState.abilitiesList.length; j++) {
      if (abilitiesState.abilitiesList[j].arraynum !== e.arraynum) {
        loopData.push(abilitiesState.abilitiesList[j]);
      }
    }
    setAbilities({
      ...abilitiesState,
      abilitiesList: loopData
    });

    let newformdata = formdata;
    formdata.fields.Special_Skills = loopData;

    setFormdata({
      ...formdata,
      fields: newformdata.fields
    });
  
   loopData = [];

    for (let k = 0; k < abilitesFormsState.abilitiesFormList.length; k++) {
      if (!k === e.arraynum) {
        const newdata = JSON.parse(
          JSON.stringify({
            visible: true,
            arraynum: k,
            Special: {
              Name: abilitesFormsState.abilitiesFormList[k].Name,
              Cost: abilitesFormsState.abilitiesFormList[k].Cost,
              Rank: abilitesFormsState.abilitiesFormList[k].Rank,
              Description: abilitesFormsState.abilitiesFormList[k].Description,
              FullTags: abilitesFormsState.abilitiesFormList[k].FullTags,
              Tags: abilitesFormsState.abilitiesFormList[k].Tags,
            }
          })
        );
        loopData.push(newdata);
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
        Tags: [],
        FullTags: []
    }

    let found = false;
    for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
      if (j === rank) {
        found = true;
        ability = abilitesFormsState.abilitiesFormList[j];
      } 
    }

    ability[fieldname] = value;

    if(fieldname === 'Tags')
    {
      let FullTagList = [];
      value.forEach(guid => {
        FullTagList.push(props.tagslist.abilityTags.find((tagf) => tagf.guid === guid))
      });
      ability.FullTags = FullTagList;
    }

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
        set1ImageChange(true);
        setFinalImage(e.FinalImage);
    }
    else 
    {
        set2ImageChange(true);
        setFinalImage2(e.FinalImage);
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
                {finalImage !== null
                  ? (
                    <div className='character-sheet-headshot'><img src={finalImage} alt='[empty character headshot]' /></div>
                  )
                  : ( <div></div> )
                }
              </div>
              <div className='input-pair'>
                <FormLabel>Current Full Body Image</FormLabel>
                {finalImage2 !== null
                  ? (
                    <div className='character-sheet-fullbody'><img src={finalImage2} alt='[empty character full body]' /></div>
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
                          guid: '',
                          title: '',                        
                          titlejpn: ''
                        }
                    }
                  />
            <FormHelperText>{(selectedSeries === undefined ||
                  selectedSeries === null ||  selectedSeries.guid === '' ) ? "required field": null}</FormHelperText>
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
                                  {...register(item.Name, {required: (item.Required === true?true:false)})}
                                  defaultValue={
                                    props.initForm.showResult === true &&
                                    props.initForm.apiMessage.fields[item.Name] !==
                                      undefined
                                      ? props.initForm.apiMessage.fields[item.Name]
                                      : ''
                                  }
                                  onChange={(e) => updateValue(e)}
                                />
                        <FormHelperText>{item.Required === true && (formdata === undefined ||
                        formdata === null ||  formdata[item.Name] === undefined || 
                                    formdata[item.Name] === null || formdata[item.Name] === ""
                                      ) ? "required field": null}</FormHelperText>
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
                        reinit={ability.reinit}
                        hideAbility={hideAbilityForm}
                        onFillIn={(rank, fieldname, value) => updateAbilityForms(rank, fieldname, value)}
                        SetAbilityValue={updateValue}
                        DownAbility={(e) => MoveAbilityDown(e)}
                        UpAbility={(e) => MoveAbilityUp(e)}
                        InitComplete={(e) => AbilityInitComplete(e)}
                      />
                      
                    ))}
                    <button className="button-action add-another-ability" onClick={(e) => addAbilityForm(e)}>Add Another Ability</button>
                  </div>

                  <>
                    <div className= "input-pair">
                                <FormLabel  className="has-tooltip"title="Directions for items to be chosen by GM: e.g. 'Two Clow Cards'">Extra Item Info</FormLabel>
                                <Input key="iteminfo" label="Item Info" variant="standard" type="input" id="iteminfo" 
                                  {...register("iteminfo")}
                                  defaultValue={
                                    props.initForm.showResult === true &&
                                    props.initForm.apiMessage.fields["iteminfo"] !==
                                      undefined
                                      ? props.initForm.apiMessage.fields["iteminfo"]
                                      : ''
                                  }
                                  onChange={(e) => updateValue(e)}
                                />
                              </div>
                            </>
                  
                  <div className="character-items-tags">
                    <div className='input-pair'>
                      <FormLabel>Sheet Item</FormLabel>
                      <TextField placeholder="no item chosen yet" disabled={true} defaultValue={itemsTableState.sheetItem} />
                      <button className="button-action addremove-sheet-item" onClick={(e) => ToggleItemPicker('Sheet Item', e)}>Add/Remove Sheet Item</button>
                    </div>
                    <div className='input-pair'>
                      <FormLabel className="has-tooltip" title="These are items linked to the character which will be in their posession at start of game.">Starting Items</FormLabel>
                      <TextField placeholder="no items chosen yet" disabled={true} defaultValue={itemsTableState.startingItems.join(', ')} />
                      <button className="button-action addremove-sheet-item" onClick={(e) => ToggleItemPicker('Starting Items', e)}>Add/Remove Starting Items</button>
                    </div>
                    <div className='input-pair'>
                      <FormLabel className="has-tooltip" title="These are items linked to the character which will not be given out at start of game, but will likely be given out as the game progresses.">Upgrade Items</FormLabel>
                      <TextField placeholder="no items chosen yet" disabled={true} defaultValue={itemsTableState.upgradeItems.join(', ')} />
                      <button className="button-action addremove-sheet-item" onClick={(e) => ToggleItemPicker('Upgrade Items', e)}>Add/Remove Upgrade Items</button>
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
                    <>
                            <div className="input-pair">
                            <FormControlLabel control={<Checkbox {...register('readyforapproval')} onChange={(e, i) => updateValue(e, i)} 
                              defaultChecked={props.initForm.showResult === true && props.initForm.apiMessage['readyforapproval'] !== undefined
                                && props.initForm.apiMessage['readyforapproval'] !== null
                               ? props.initForm.apiMessage['readyforapproval']
                                : false
                           } />}
                              label={'Sheet Is Ready for Approval'}
                            />
                            </div>
                          </>
                    
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
            <button className="button-cancel" onClick={() => props.GoBack()}>Go Back</button>
            <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Save Sheet</button>
            <button className="button-action" onClick={() => togglePreview(true)}>Preview</button>
            {props.initForm.showResult && props.initForm.apiMessage.secondapprovalbyUserGuid === null
            && props.authLevel > 2 && props.currenUserGuid !== props.initForm.apiMessage.firstapprovalbyuserGuid &&
            props.currenUserGuid !== props.initForm.apiMessage.firstapprovalbyuserGuid &&
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
                , selectedSeries, gmNotes)} img={finalImage} img2={finalImage2}/>
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
           tagslist={props.tagslist.characterTags}
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
  larpRunTags: PropTypes.object,
  Submit: PropTypes.func,
  FetchPopoverItem: PropTypes.func,
  userGuid: PropTypes.string,
  showResult: PropTypes.bool,
  initForm: PropTypes.object,
  apiMessage: PropTypes.object,
  ReturnItem: PropTypes.func,
  GoBack: PropTypes.func,
  Approve: PropTypes.func,
  seriesList: PropTypes.array,
  img: PropTypes.string,
  img2: PropTypes.string,
}