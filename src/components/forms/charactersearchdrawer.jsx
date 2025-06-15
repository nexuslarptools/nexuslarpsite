import PropTypes from 'prop-types';
import SearchIcon from '../icon/searchicon';
import { useEffect, useState } from 'react';
import AttributeSearchField from '../inputs/attributesearchfield';
import '../drawer/_searchdrawer.scss';
import { Autocomplete, Box, TextField } from '@mui/material';
import GenericSearchField from '../inputs/genericsearchfield';
import powerOptions from './../../jsonfiles/powerOptions.json'
import compareOptions from './../../jsonfiles/compareoptions.json'

const CharacterSearchDrawer = props => {

    const [filterInit, setfilterInit] = useState(
        {
            Name: false,
            AlternateName: false
        }
    );
    const [loaded, setLoaded] = useState(false);
    const [tagSelectValuesCharacter, setTagSelectValuesCharacter] = useState([]);
    const [tagSelectValuesCharacterOr, setTagSelectValuesCharacterOr] = useState([]);
    const [currentCharacterTagList, setCurrentCharacterTagList] = useState([]);
    const [tagSelectValuesAbility, setTagSelectValuesAbility] = useState([]);
    const [tagSelectValuesAbilityOr, setTagSelectValuesAbilityOr] = useState([]);
    const [currentAbilityTagList, setCurrentAbilityTagList] = useState([]);

    useEffect(() => {
        if (props.init !== undefined && props.init !== null) {
                
        let tagCharDrowdownList = [];
        let tagAbilDrowdownList = [];
        props.tagslist.forEach(taggroup => {
             if (taggroup.tagType === 'Character' || taggroup.tagType === 'LARPRun' ) {
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
        setCurrentCharacterTagList(tagCharDrowdownList);
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
                           } else {
                             Abiltags.push(tag);
                           }
                        })
                        setTagSelectValuesCharacter(Chartags);
                        setTagSelectValuesAbility(Abiltags);
                    }
                    else if (key === "OrTags") {
                        let Chartags = [];
                        let Abiltags = [];
                        props.init[key].forEach(tag => {
                           if (tagCharDrowdownList.includes(tag)) {
                             Chartags.push(tag);
                           } else {
                             Abiltags.push(tag);
                           }
                        })
                        setTagSelectValuesCharacterOr(Chartags);
                        setTagSelectValuesAbilityOr(Abiltags);
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

        if(type === 'Character') {
        await setTagSelectValuesCharacter(e);
        tagSelectValuesAbility.forEach(element => {
          currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'AndTags');
        }

        if(type === 'Ability') {
        await setTagSelectValuesAbility(e);
        tagSelectValuesCharacter.forEach(element => {
           currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'AndTags');
        }

        if(type === 'CharacterOr') {
        await setTagSelectValuesCharacterOr(e);
        tagSelectValuesAbilityOr.forEach(element => {
        currtagslist.push(element)
        });
        props.updatesearch(currtagslist, 'OrTags');
        }

        if(type === 'AbilityOr') {
        await setTagSelectValuesAbilityOr(e);
        tagSelectValuesCharacterOr.forEach(element => {
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
         <SearchIcon label="Alternate Name" initalFilter={ props.init !== null &&
            props.init.AlternateName !== undefined && props.init.AlternateName !== null ? props.init.AlternateName: null}  
            FilterInit={filterInit.AlternateName} UnInitFiler={() => nofilterInit('AlternateName')}
            clearfilter={props.clearfilterState} filterup={e => props.updatesearch(e, 'AlternateName')}/>
            <hr/>
            <div className='attributesearch-label'>
            Attribute Search:
            </div>
            { props.init.Attribute !== undefined && props.init.Attribute !== null ?
                       <>
                        {  props.init.Attribute.map((attrib) =>
                <div key={attrib.Position}> 
                <Box sx={{ border: '1px solid gray' }}>
                <AttributeSearchField key={attrib.Position}
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
                                      value={tagSelectValuesCharacter}
                                      id="multiple-limit-tags"
                                      options={currentCharacterTagList}
                                      getOptionLabel={(option) => option !== undefined 
                                         && option.name !== undefined ?
                                        option.name : ''}
                                      onChange={(event, val) => updateTags('Character', val)}
                                      renderInput={(params) => (
                                        <TextField placeholder='Character Tags That WILL Be Present' {...params} />
                                      )}
                                    />
                                  </div>
                                                                    <div className='input-pair'>
                                    <Autocomplete
                                      multiple
                                      key={'characterlist'}
                                      value={tagSelectValuesCharacterOr}
                                      id="multiple-limit-tags"
                                      options={currentCharacterTagList}
                                      getOptionLabel={(option) => option !== undefined 
                                         && option.name !== undefined ?
                                        option.name : ''}
                                      onChange={(event, val) => updateTags('CharacterOr', val)}
                                      renderInput={(params) => (
                                        <TextField placeholder='Character Tags That MAY Be Present' {...params} />
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

export default CharacterSearchDrawer

CharacterSearchDrawer.propTypes = {
    init: PropTypes.object,
    clearfilterState: PropTypes.bool,
    updatesearch: PropTypes.func,
    dropatribute: PropTypes.func,
    AddAttribute: PropTypes.func,
    LoadingDone: PropTypes.func,
    AddSkill: PropTypes.func,
    tagslist:PropTypes.array
  }