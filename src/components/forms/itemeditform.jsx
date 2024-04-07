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
      "hasreview": false
  });
    const [JSONData, setJSONData] = useState([]);
    const [gmNotes, setGMNotes] = useState('');
    const [selectedOption, setSelectedOption] = useState('Generic');
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

    const [abilitiesState, setAbilities] = useState({
      abilitiesList: JSON.parse(JSON.stringify([{ arraynum: 0, visible: true }])),
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
            Values: sectionData
          }
          formData.push(section);
        }
        await setJSONData(formData);
    
        const loopData = [];
        const loopDataWithNulls = [];
    
        if (props.initForm.showResult) {
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
    
              let newData = JSON.parse(
                JSON.stringify({
                  arraynum: i,
                  visible: true,
                  Special: {
                    Name: oldName,
                    Cost: oldCost,
                    Rank: oldRank,
                    Description: oldDescription,
                    Tags: oldTags
                  }
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
                  Special: {
                    Name: oldName,
                    Cost: oldCost,
                    Rank: oldRank,
                    Description: oldDescription,
                    Tags: oldTags
                  }
                })
              )
              loopDataWithNulls.push(newData);
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
        setAbilities({
          ...abilitiesState,

          abilitiesList: loopData
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

        if ( props.initForm !== null && props.initForm.apiMessage !== null)
        {
          outputbody.guid = props.initForm.apiMessage.guid;
        }

        outputbody.Fields.Tags = tagState.listTags;
        props.SubmitForm(outputbody);
      }



      const updateValue = async (e, i) => {
        if (i !== true && i !== false) {
        await setValue(e.target.name, e.target.value);
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
        else {
          let itemFields = itemData.fields;
          itemFields.fields[e.target.name] = i;
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
  
    const updateAbilityForms = (e) => {
      let namehere = null;
      if (e.name != null) {
        namehere = e.name;
      }
  
      let engeryCosthere = null;
      if (e.energyCost != null) {
        engeryCosthere = e.energyCost;
      }
  
      let rankhere = null;
      if (e.rank != null) {
        rankhere = e.rank;
      }
  
      let deschere = null;
      if (e.desc != null) {
        deschere = e.desc;
      }
  
      let tagshere = null;
      if (e.tags != null) {
        tagshere = e.tags;
      }
  
      const newData = JSON.parse(
        JSON.stringify({
          arraynum: e.arraynum,
          visible: true,
          Special: {
            Name: namehere,
            Cost: engeryCosthere,
            Rank: rankhere,
            Description: deschere,
            Tags: tagshere
          }
        })
      )
  
      const loopData = [];
      let found = false;
  
      for (let j = 0; j < abilitesFormsState.abilitiesFormList.length; j++) {
        if (j === e.arraynum) {
          loopData.push(newData);
          found = true;
        } else {
          loopData.push(abilitesFormsState.abilitiesFormList[j]);
        }
      }
  
      if (!found) {
        loopData.push(newData);
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
                        onChange={(event, val) => upDateSeries(val)}
                        isOptionEqualToValue={(option, value) => option.guid === value.guid}
                        renderInput={(params) => <TextField placeholder="choose series" {...params} />}
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
                      {section.Types.some(type => type === 'All' || type === selectedOption)  ? 
                      <>
                        { section.Heading !== "General"
                          ? <header key={section.Heading} className="header">{section.Heading}</header>
                          : <></>
                        }
                        {section.Values.map((item) => (
                          <> 
                            {item.Type === 'Input'  && 
                            (item.Types.some(type => type === 'All' || type === selectedOption))
                              ? ( 
                                <>
                                  <div key={item.Label} className={item.Label !== "Character Bio" ? "input-pair" : "input-pair full-width"}>
                                    <FormLabel  className={item.ToolTip !== undefined && item.ToolTip !== null ? "has-tooltip":""} title={item.ToolTip}>{item.Label} </FormLabel>
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
                                <FormControlLabel control={<Checkbox {...register(item.Name)} onChange={(e, i) => updateValue(e, i)} 
                                  defaultChecked={
                                    props.initForm !== null && 
                                    props.initForm.showResult === true && 
                                    props.initForm.apiMessage !== null &&
                                    props.initForm.apiMessage[item.Name] !== undefined
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

                      {item.Type === 'SpecialSkillsInput'  && item.Types.some(type => type === 'All' || type === selectedOption) ?
                      <div className='character-sheet-powers'>
                        {abilitiesState.abilitiesList.map((ability) => (
                          <ItemAbilites
                            itemTags={props.tagslist.abilityTags}
                            key={ability.arraynum}
                            abilityState={ability}
                            hideAbility={hideAbilityForm}
                            onFillIn={updateAbilityForms}
                            SetAbilityValue={updateValue}
                          />
                          
                        ))}
                        <button className="button-action add-another-ability" onClick={(e) => addAbilityForm(e)}>Add Another Ability</button>
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


