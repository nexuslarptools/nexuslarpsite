import PropTypes from 'prop-types';
import SearchIcon from '../icon/searchicon';
import { useEffect, useState } from 'react';
import '../drawer/_searchdrawer.scss';
import { Autocomplete, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import GenericSearchField from '../inputs/genericsearchfield';
import powerOptions from '../../jsonfiles/powerOptions.json'
import compareOptions from './../../jsonfiles/compareoptions.json'
import ItemAttributeSearchField from '../inputs/itemattributesearchfield';

const ItemSearchDrawer = props => {

    const [filterInit, setfilterInit] = useState(
        {
            Name: false,
            AlternateName: false
        }
    );

const types = [     '',
                    "Accessory",
					"Ammo",
					"Armor",
					"Artifact",
					"Book",
					"Clothing",
					"Companion",
					"Document",
					"Food",
					"Furniture",
					"Generic",
					"Instrument",
					"Location",
					"Material",
					"Mecha",
					"Medical",
					"Pokemon",
					"Power",
					"Spell",
					"Supplies",
					"Tech",
					"Unique",
					"Valuable",
					"Vehicle",
					"Weapon"
				];

    const [loaded, setLoaded] = useState(false);
     const [itemType, setItemType] = useState('');
    const [tagSelectValuesItem, setTagSelectValuesItem] = useState([]);
    const [tagSelectValuesItemOr, setTagSelectValuesItemOr] = useState([]);
    const [currentItemTagList, setCurrentItemTagList] = useState([]);
    const [tagSelectValuesAbility, setTagSelectValuesAbility] = useState([]);
    const [tagSelectValuesAbilityOr, setTagSelectValuesAbilityOr] = useState([]);
    const [currentAbilityTagList, setCurrentAbilityTagList] = useState([]);

    const handleItemTypeChange = async(e) => {
      await setItemType(e.target.value);
      props.updatesearch(e.target.value, 'ItemType');
    }

    useEffect(() => {
        if (props.init !== undefined && props.init !== null) {
                
        let tagCharDrowdownList = [];
        let tagAbilDrowdownList = [];
        props.tagslist.forEach(taggroup => {
             if (taggroup.tagType === 'Item' || taggroup.tagType === 'LARPRun' ) {
                 taggroup.tagsList.forEach(tag => {
                    tagCharDrowdownList.push(tag);
                 })
             }
            if (taggroup.tagType === 'Ability') {
                 taggroup.tagsList.forEach(tag => {
                    tagAbilDrowdownList.push(tag);
                 })
             }
        })
        setCurrentItemTagList(tagCharDrowdownList);
        setCurrentAbilityTagList(tagAbilDrowdownList);

        let initobj = {}
            for (const key in props.init) {
                if (props.init[key] !== undefined && props.init[key] !== null) {
                    if(key === "AndTags") {
                        let Chartags = [];
                        let Abiltags = [];
                        props.init[key].forEach(tag => {
                           if (tagCharDrowdownList.includes(tag)) {
                             Chartags.push(tag);
                           }  else if (tagAbilDrowdownList.includes(tag)) {
                             Abiltags.push(tag);
                           }
                        })
                        setTagSelectValuesItem(Chartags);
                        setTagSelectValuesAbility(Abiltags);
                    }
                    else if (key === "OrTags") {
                        let Chartags = [];
                        let Abiltags = [];
                        props.init[key].forEach(tag => {
                           if (tagCharDrowdownList.includes(tag)) {
                             Chartags.push(tag);
                           }  else if (tagAbilDrowdownList.includes(tag)) {
                             Abiltags.push(tag);
                           }
                        })
                        setTagSelectValuesItemOr(Chartags);
                        setTagSelectValuesAbilityOr(Abiltags);
                    } else if (key === 'ItemType') {
                        setItemType(props.init[key])
                    }
                    else {
                    initobj[key] = true
                    }
                }
            }
            setfilterInit(initobj);
                setLoaded(true); 
             }}, []);

      const updateTags = async (type, e) => {

        let currtagslist = [] 
        e.forEach(element => {
          currtagslist.push(element)
        });

        if(type === 'Item') {
        await setTagSelectValuesItem(e);
        tagSelectValuesAbility.forEach(element => {
          currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'AndTags');
        }

        if(type === 'Ability') {
        await setTagSelectValuesAbility(e);
        tagSelectValuesItem.forEach(element => {
           currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'AndTags');
        }

        if(type === 'ItemOr') {
        await setTagSelectValuesItemOr(e);
        tagSelectValuesAbilityOr.forEach(element => {
        currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'OrTags');
        }

        if(type === 'AbilityOr') {
        await setTagSelectValuesAbilityOr(e);
        tagSelectValuesItemOr.forEach(element => {
        currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'OrTags');
        }
      }

const nofilterInit = async(e) => {
    setfilterInit(
        { ...filterInit,
            [e]:false
        });
    };
    
    return (
         loaded === true ?
        <>
        <SearchIcon label="Name"  initalFilter={props.init !== null &&
            props.init.Name !== undefined && props.init.Name !== null ? props.init.Name: null} 
            FilterInit={filterInit.Name} UnInitFiler={() => nofilterInit('Name')}
            clearfilter={props.clearfilterState} filterup={e => props.updatesearch(e, 'Name')}/>

        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Item Type</InputLabel>
        <Select sx={{ width: 400 }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={itemType}
          label="Type"
          onChange={(e) => handleItemTypeChange(e)} >
            {types.map(item => (
            <MenuItem key={item}
              value={item}>{item === '' ? 'No Selection': item}</MenuItem>
            ))}
          </Select>
         </FormControl>
            
            <hr/>
            <div className='attributesearch-label'>
            Attribute Search:
            </div>
            { props.init.Attribute !== undefined && props.init.Attribute !== null ?
                       <>
                        {  props.init.Attribute.map((attrib) =>
                <div key={attrib.Position}> 
                <Box sx={{ border: '1px solid gray' }}>
                <ItemAttributeSearchField key={attrib.Position} type={itemType}
             init={attrib !== undefined && attrib !== null ? attrib : null}
             LoadingDone={(e) => props.LoadingDone(e, attrib.Position, 'Attribute')}
             drop={(e) => props.dropatribute(e, 'Attribute')}
             updateSearch={(e) => props.updatesearch(e, 'Attribute')}/>
             </Box>
            </div>
            )}
                </> : 
                <></> }
                <button className='.button-basic' onClick={() => props.AddAttribute('Attribute')}>Add Attribute</button>
                <hr/>
                                  <div className='input-pair'>
                                    <Autocomplete
                                      multiple
                                      key={'characterlist'}
                                      value={tagSelectValuesItem}
                                      id="multiple-limit-tags"
                                      options={currentItemTagList}
                                      getOptionLabel={(option) => option !== undefined 
                                         && option.name !== undefined ?
                                        option.name : ''}
                                      onChange={(event, val) => updateTags('Item', val)}
                                      renderInput={(params) => (
                                        <TextField placeholder='Item Tags That WILL Be Present' {...params} />
                                      )}
                                    />
                                  </div>
                                  <div className='input-pair'>
                                    <Autocomplete
                                      multiple
                                      key={'characterlist'}
                                      value={tagSelectValuesItemOr}
                                      id="multiple-limit-tags"
                                      options={currentItemTagList}
                                      getOptionLabel={(option) => option !== undefined 
                                         && option.name !== undefined ?
                                        option.name : ''}
                                      onChange={(event, val) => updateTags('ItemOr', val)}
                                      renderInput={(params) => (
                                        <TextField placeholder='Item Tags That MAY Be Present' {...params} />
                                      )}
                                    />
                                  </div>
                <hr/>
            <div className='attributesearch-label'>
            Special Skills Search:
            </div>
            { props.init.SpecialSkill !== undefined && props.init.SpecialSkill !== null ?
            <>
            {props.init.SpecialSkill.map((attrib) =>
            <div key={attrib}> 
            <Box sx={{ border: '1px solid gray' }}>
               <GenericSearchField key={attrib.Position}
                LoadingDone={(e) => props.LoadingDone(e, attrib.Position, 'SpecialSkill')}
                init={attrib !== undefined && attrib !== null ? attrib : null}
                formData={powerOptions.powerOptions}
                drop={(e) => props.dropatribute(e, 'SpecialSkill')}
                compareOptions={compareOptions.compareOptions}
                updateSearch={(e) => props.updatesearch(e, 'SpecialSkill')}
                />
            </Box>
            </div> )}
             </> : 
                <></> }
            <button className='.button-basic' onClick={() => props.AddAttribute('SpecialSkill')}>Add Special Skill</button>
            <hr/>
                                              <div className='input-pair'>
                                    <Autocomplete
                                      multiple
                                      key={'characterlist'}
                                      value={tagSelectValuesAbility}
                                      id="multiple-limit-tags"
                                      options={currentAbilityTagList}
                                      getOptionLabel={(option) => option !== undefined 
                                         && option.name !== undefined ?
                                        option.name : ''}
                                      onChange={(event, val) => updateTags('Ability',val)}
                                      renderInput={(params) => (
                                        <TextField placeholder='Ability Tags That WILL Be Present' {...params} />
                                      )}
                                    />
                                  </div>
                                <div className='input-pair'>
                                    <Autocomplete
                                      multiple
                                      key={'characterlist'}
                                      value={tagSelectValuesAbilityOr}
                                      id="multiple-limit-tags"
                                      options={currentAbilityTagList}
                                      getOptionLabel={(option) => option !== undefined 
                                         && option.name !== undefined ?
                                        option.name : ''}
                                      onChange={(event, val) => updateTags('AbilityOr',val)}
                                      renderInput={(params) => (
                                        <TextField placeholder='Ability Tags That MAY Be Present' {...params} />
                                      )}
                                    />
                                  </div>
        </>
        :
        <></>

    )
}

export default ItemSearchDrawer

ItemSearchDrawer.propTypes = {
    init: PropTypes.object,
    clearfilterState: PropTypes.bool,
    updatesearch: PropTypes.func,
    dropatribute: PropTypes.func,
    AddAttribute: PropTypes.func,
    LoadingDone: PropTypes.func,
    AddSkill: PropTypes.func,
    tagslist:PropTypes.array
  }