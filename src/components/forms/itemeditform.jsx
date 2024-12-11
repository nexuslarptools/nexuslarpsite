import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { Form, FormGroup } from 'reactstrap';
import ItemAbilites from '../specialskills/ItemAbilites';
import MultiTextField from '../inputs/multitextfield';
import { green } from '@mui/material/colors';
import PhotoCropper from '../photocropper/photocropper';
import Item from '../item/item';
import './_itemeditform.scss';
import {
  Autocomplete, TextField,
  FormControlLabel, FormLabel, Input, Box, Checkbox, Select, MenuItem,
  FormHelperText
} from '@mui/material';
import ReviewNotesDisplay from '../reviewnotes/reviewnotesdisplay';
import ReviewNotesForm from '../reviewnotes/reviewnotesform';

const ItemEditForm = (props) => {
    const formRef = React.useRef();
    const { register, handleSubmit, setValue } = useForm({
      mode: 'onSubmit',
      reValidateMode: 'onBlur'
    });
    const [imageLocation, setImageLocation] = useState(null);
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

    const [reviewsState, setReviewsState] = useState([]);

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
    const [imgUpdated, setImgUpdated] = useState(false);

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

          if (!imgUpdated) {
            await setImageLocation(props.img);
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


          if (props.initForm.apiMessage.back !== undefined && props.initForm.apiMessage.back !== null &&
            props.initForm.apiMessage.back.fields !== undefined && props.initForm.apiMessage.back.fields !== null && 
            props.initForm.apiMessage.back.fields.Special_Skills !== undefined &&
            props.initForm.apiMessage.back.fields.Special_Skills !== null) {
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
                    FullTags: initial

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
                    Tags: oldTags,
                    FullTags: initial
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

      const RemoveReview = (id) => {
        const newReviewList = [];
        reviewsState.forEach(element => {
          if (element.id !== id) {
            newReviewList.push(element);
          }
        });
        setReviewsState(newReviewList);
      }

      const ToggleDoubleSide = async () => {
        let currdeoubleside = !IsdoubleSide;
        setIsdoubleSide(currdeoubleside);

        await setItemData({
          ...itemData,
          isdoubleside: currdeoubleside
        });
      }

      const ToggleReadyForApprove = async () => {
        let toggleval = !itemData.readyforapproval

        await setItemData({
          ...itemData,
          readyforapproval: toggleval
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
          readyforapproval:itemData.readyforapproval,
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

        if (itemData.back !== undefined && itemData.back.fields !== null && itemData.back.fields.Special_Skills !== undefined 
          && itemData.back.fields.Special_Skills !== null) {

            itemData.back.fields.Special_Skills.forEach(skill => { 
              if(skill.visible !== true) {
                const index = itemData.back.fields.Special_Skills.indexOf(skill);
                   if (index > -1) { 
                      itemData.back.fields.Special_Skills.splice(index, 1);
                    }
              }
            });

          }
          if (itemData.back !== undefined && itemData.back.fields !== null)
        {
          outputbody.Back = itemData.back;
        }
        props.SubmitForm(outputbody, imageLocation, imgUpdated);
      }

      const updateValue = async (e, i) => {
        if (i !== true && i !== false) {
        if (e.target.value.includes("Remove") && !e.target.name.includes("Desc")) {
          await setValue(e.target.name, null);
        }
        else {
          await setValue(e.target.name, e.target.value);
        }
        
        if (e.target.name === 'Description2ndSide') {
          let back = itemData.back;
          if (back.fields === undefined || back.fields === null) {
            back.fields = {};
          }
          back.fields.Description = e.target.value;
          await setItemData({
            ...itemData,
            back: back
          });
        } else {
        let itemFields = itemData.fields;

        if (e.target.value.includes("Remove") && !e.target.name.includes("Desc")) {
          itemFields[e.target.name] = null;
        }
        else {
          itemFields[e.target.name] = e.target.value;
        }

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
        Tags: [],
        FullTags: [],
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
        Tags: [],
        FullTags: [],
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
        if (abilitiesState.abilitiesList[j].arraynum !== e.arraynum) {
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
        if (!k === e.arraynum) {
          const newdata = JSON.parse(
            JSON.stringify({
              visible: true,
              arraynum: k,
              Tags: abilitesFormsState.abilitiesFormList[k].Tags,
              FullTags: abilitesFormsState.abilitiesFormList[k].FullTags,
              Name: abilitesFormsState.abilitiesFormList[k].Name,
              Cost: abilitesFormsState.abilitiesFormList[k].Cost,
              Rank: abilitesFormsState.abilitiesFormList[k].Rank,
              Description: abilitesFormsState.abilitiesFormList[k].Description
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


    const hideAbilityBackForm = (e) => {
      handleDeleteClose(e);
      e.visible = false;

      let loopData = [];
  
      for (let j = 0; j < abilitiesState.abilitiesListBack.length; j++) {
        if (abilitiesState.abilitiesListBack[j].arraynum !== e.arraynum) {
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
    const MoveAbilityDown = (rank) => {
      if (rank !== abilitesFormsState.abilitiesFormList.length -1) {
        let data = [...abilitesFormsState.abilitiesFormList];
        let temp = data[rank+1];
        temp.arraynum = rank;
        temp.reinit = true;
        data[rank+1] = data[rank];
        data[rank+1].arraynum = rank + 1
        data[rank+1].reinit = true;
        data[rank+1].arraynum = rank + 1
        data[rank] = temp;

        setAbilitesForms({
          ...abilitesFormsState,
          abilitiesFormList: data
        });
        setAbilities({
          ...abilitiesState,
          abilitiesList: data
        });

        let fields = itemData.fields;
        fields.Special_Skills=data;
  
        setItemData({
          ...itemData,
          fields: fields
        });
      }
    }

    const MoveAbilityUp = (rank) => {
        if (rank > 0) {
        let data = [...abilitesFormsState.abilitiesFormList];
        let temp = data[rank-1];
        temp.arraynum = rank;
        temp.reinit = true;
        data[rank-1] = data[rank];
        data[rank-1].arraynum = rank -1;
        data[rank-1].reinit = true;
        data[rank] = temp;

        setAbilitesForms({
          ...abilitesFormsState,
          abilitiesFormList: data
        });
        setAbilities({
          ...abilitiesState,
          abilitiesList: data
        });

        let fields = itemData.fields;
        fields.Special_Skills=data;
  
        setItemData({
          ...itemData,
          fields: fields
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

      let fields = itemData.fields;
      fields.Special_Skills=data;

      setItemData({
        ...itemData,
        fields: fields
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

      if(fieldname === 'Tags'){
          let FullTagList = [];
          value.forEach(guid => {
            FullTagList.push(props.tagslist.abilityTags.find((tagf) => tagf.guid === guid))
          });
          ability.FullTags = FullTagList;
        }

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

      let fields = itemData.fields;
      fields.Special_Skills=itemformData;

      setItemData({
        ...itemData,
        fields: fields
      });
    }


    const MoveAbilityBackDown = async (rank) => {
      if (rank !== abilitesBackFormsState.abilitiesFormList.length - 1) {
        let data = [...abilitesBackFormsState.abilitiesFormList];
        let temp = data[rank+1];
        temp.arraynum = rank;
        temp.reinit = true;
        data[rank+1] = data[rank];
        data[rank+1].arraynum = rank + 1
        data[rank+1].reinit = true;
        data[rank] = temp;

        setAbilitesBackForms({
          ...abilitesBackFormsState,
          abilitiesFormList: data
        });
        setAbilities({
          ...abilitiesState,
          abilitiesListBack: data
        });
  
        let back = itemData.back;
        if (back.fields === undefined || back.fields == null)
        {
          back.fields={};
        }
        back.fields.Special_Skills=data;
  
        await setItemData({
          ...itemData,
          back: back
        });
      }
    }

    const MoveAbilityBackUp = async (rank) => {
        if (rank > 0) {
        let data = [...abilitesBackFormsState.abilitiesFormList];
        let temp = data[rank-1];
        temp.arraynum = rank;
        temp.reinit = true;
        data[rank-1] = data[rank];
        data[rank-1].arraynum = rank -1
        data[rank-1].reinit = true;
        data[rank] = temp;

        setAbilitesBackForms({
          ...abilitesBackFormsState,
          abilitiesFormList: data
        });
        setAbilities({
          ...abilitiesState,
          abilitiesListBack: data
        });
  
        let back = itemData.back;
        if (back.fields === undefined || back.fields == null)
        {
          back.fields={};
        }
        back.fields.Special_Skills=data;
  
        await setItemData({
          ...itemData,
          back: back
        });
      }
    }

    const AbilityInitBackComplete = async (e) => {
      let data = [...abilitesBackFormsState.abilitiesFormList];
      data[e].reinit=false;

      setAbilitesBackForms({
        ...abilitesBackFormsState,
        abilitiesFormList: data
      });
      setAbilities({
        ...abilitiesState,
        abilitiesListBack: data
      });

      let back = itemData.back;
      if (back.fields === undefined || back.fields == null)
      {
        back.fields={};
      }
      back.fields.Special_Skills=data;

      await setItemData({
        ...itemData,
        back: back
      });

    }


    const updateAbilityBackForms = async (rank, fieldname, value) =>{

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
      for (let j = 0; j < abilitesBackFormsState.abilitiesFormList.length; j++) {
        if (j === rank) {
          found = true;
          ability = abilitesBackFormsState.abilitiesFormList[j];
        } 
      }

      ability[fieldname] = value;

      if(fieldname === 'Tags'){
        let FullTagList = [];
        value.forEach(guid => {
          FullTagList.push(props.tagslist.abilityTags.find((tagf) => tagf.guid === guid))
        });
        ability.FullTags = FullTagList;
      }

  
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
      if (back.fields === undefined || back.fields == null)
      {
        back.fields={};
      }
      back.fields.Special_Skills=itemformData;

      await setItemData({
        ...itemData,
        back: back
      });
    }

    const setImageData = async (e) => {
      await setImageLocation(e.FinalImage);
      await setImgUpdated(true);
    }

    return (
        <>
          <div className="character-sheet-form">
          <div className='character-sheet-images'>
            <Form ref={formRef}>
              <FormGroup>
                <div className="input-pair">
                <FormLabel>Item Image</FormLabel>
                  <PhotoCropper description={'Item '} width={4.9} length={3} ReturnImage={(e) => setImageData(e)}  />
                  <div className='image-note'><b>Note:</b> Please keep images to no more than 400px in width.  
                  You may need to add white space on all sides. </div>
                </div>
              <div>
                Current Item Preview 
                <Item item={itemData} img={imageLocation}/>
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
                                      title={item.ToolTip}> {item.Required !== true && formdata !== undefined && formdata !== null && formdata[item.name] !== undefined 
                                        && formdata[item.name] !== null && formdata[item.name] !== '' ?item.Label +" required field":item.Label } </FormLabel>
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
                      {...register(item.Name, {required: (item.Required === true?true:false)})}
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
                          props.initForm.apiMessage !== null && props.initForm.apiMessage.back.fields !== null &&
                          props.initForm.apiMessage.back.fields !== undefined  && item.Name === 'Description2ndSide'
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
                                      title={item.ToolTip}> {item.Label} </FormLabel>
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
                                    type="input" 
                                    id={item.Name} 
                                    inputProps={
                                    item.Limit !== undefined 
                                    && item.Limit !== null 
                                    ? { maxLength: item.Limit } : {}}
                                      {...register(item.Name, {required: (item.Required === true?true:false)})}
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
                                    <FormHelperText>{item.Required === true && (itemData.fields[item.Name] === undefined || 
                                    itemData.fields[item.Name] === null || itemData.fields[item.Name] === ""
                                      ) ? "required field": null}</FormHelperText>
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
                                    <FormLabel  className={item.ToolTip !== undefined && item.ToolTip !== null ? "has-tooltip":""} title={item.ToolTip}>
                                      {item.Required !== true && formdata !== undefined && formdata !== null && formdata[item.name] !== undefined 
                                        && formdata[item.name] !== null && formdata[item.name] !== '' ?item.Label +" required field":item.Label } </FormLabel>
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
                                        {...register(item.Name, {required: (item.Required === true?true:false)})}
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
                                    {...register(item.Name, {required: (item.Required === true?true:false)})}
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
                                <FormControlLabel control={<Checkbox {...register(item.Name, {required: (item.Required === true?true:false)})} 
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
                            reinit={ability.reinit}
                            hideAbility={hideAbilityForm}
                            onFillIn={(rank, fieldname, value) => updateAbilityForms(rank, fieldname, value)}
                            SetAbilityValue={updateValue}
                            DownAbility={(e) => MoveAbilityDown(e)}
                            UpAbility={(e) => MoveAbilityUp(e)}
                            InitComplete={(e) => AbilityInitComplete(e)}
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
                            DownAbility={(e) => MoveAbilityBackDown(e)}
                            UpAbility={(e) => MoveAbilityBackUp(e)}
                            InitComplete={(e) => AbilityInitBackComplete(e)}
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
       <FormControlLabel control={<Checkbox 
                                onChange={()  => ToggleReadyForApprove()} 
                                  defaultChecked={ props.initForm !== undefined &&
                                    props.initForm !== null && 
                                    props.initForm.showResult === true ? props.initForm.apiMessage.readyforapproval  : false } />}
                                label='Item Is Ready for Approval'
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

          <div>  
              {reviewsState.length > 0 ?
              reviewsState.map(message => 
                <ReviewNotesDisplay key={message} message={message} RemoveReview={(id) => RemoveReview(id)} />)
                : <ReviewNotesForm  AddReview={(e) => AddReview(e)} type={'Item'} />
              }
          <div>
            {'&nbsp'}
            </div>
            </div>

        <div className="edit-bottom">
                      <button className="button-cancel" onClick={() => props.GoBack(false)}>Go Back</button>
                      <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Submit Changes</button>
                      {props.initForm.showResult && props.initForm.apiMessage.secondapprovalbyuserGuid === null &&
                      props.currenUserGuid !== props.initForm.apiMessage.firstapprovalbyuserGuid &&
                        props.currenUserGuid !== props.initForm.apiMessage.editbyUserGuid  ?
                      <button className="button-action" onClick={() => props.Approve()}>Approve Item</button>
            :<></>}
        </div>
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
  currenUserGuid: PropTypes.string,
  img: PropTypes.string
}


