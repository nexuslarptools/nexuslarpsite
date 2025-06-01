import { useEffect, useState } from 'react';
import Loading from '../loading/loading'
import './_specialskillssearchfield.scss'
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import PropTypes from 'prop-types';
import SearchIcon from '../icon/searchicon';
import { FormControl, FormLabel, InputLabel, MenuItem, Select } from '@mui/material';
import compareOptions from './../../jsonfiles/compareoptions.json'

const SpecialSkillsSearchField = (props) => {

        const [currValue, setCurrValue] = useState({
            Attribute: null,
            CompareType: null,
            Value: null,
            AndOr: 'And',
            Position: 0
        });

            const [checked, setChecked] = useState(true)
            const [filterInit, setfilterInit] = useState(
                    {
                        Attribute: false,
                        CompareType: false,
                        Value: false,
                    }
                );
                
                const [loaded, setLoaded] = useState(false);

                        useEffect(() => {
                            if (props.init !== undefined && props.init !== null && props.init.Loading) {
                                let initobj = {}
                                setCurrValue(props.init);
                                for (const key in props.init) {
                                    if (props.init[key] !== undefined && props.init[key] !== null) {
                                        initobj[key] = true
                                        if (key === 'AndOr' && props.init[key] === 'Or')
                                        {
                                            setChecked(false);
                                        }
                                    }
                                }
                                setfilterInit(initobj);
                                setLoaded(true);
                                props.LoadingDone(true);       
                                 }}, [props.init.Loading]);

                const nofilterInit = async(e) => {
                    setfilterInit(
                        { ...filterInit,
                            [e]:false
                        });
                
                };
            
                const handleChangeSelect = (e, fieldname) => {
                    let newval=currValue;
                    if (e.target !== undefined) {
                        newval[fieldname]= e.target.value
                      setCurrValue({
                          ...currValue,
                          [fieldname]: e.target.value
                      });
                    }
                    else {
                        if (fieldname === 'AndOr')
                        {
                            const change = !checked;
                            setChecked(change);
                            newval[fieldname]= change ? 'And':'Or'
                            setCurrValue({
                                ...currValue,
                                [fieldname]: change ? 'And':'Or'
                            });
                        }
                        else {
                          newval[fieldname]= e
                          setCurrValue({
                              ...currValue,
                              [fieldname]: e
                          });
                       }
                    }
                    props.updateSearch(newval);
                }


if (!loaded) {
    <>
    <Loading/>
    </>
}
else {
    return ( 
        <>
        <div className='specialSkills-box'>

         <SearchIcon label="Ability Name" initalFilter={ props.init !== undefined &&  props.init !== null &&
            props.init.Value !== undefined && props.init.Value !== null ? props.init.Value: null}  
            FilterInit={filterInit.Value} UnInitFiler={() => nofilterInit('Name')}
            clearfilter={props.clearfilterState} filterup={e => handleChangeSelect(e, 'Name')}/>

           <SearchIcon label="Skill" initalFilter={ props.init !== undefined &&  props.init !== null &&
            props.init.Value !== undefined && props.init.Value !== null ? props.init.Value: null}  
            FilterInit={filterInit.Value} UnInitFiler={() => nofilterInit('Skill')}
            clearfilter={props.clearfilterState} filterup={e => handleChangeSelect(e, 'Skill')}/>

             <FormControl sx={{ width: '40%', paddingLeft: '5px', paddingRight: '5px',
                   paddingTop: '10px'}}>
              <InputLabel sx={currValue.CompareType === null ?
                  {fontSize: 15}: 
                  {fontSize: 15, paddingTop: '10px'}}  id="demo-simple-select-label">Comparison</InputLabel>
               <Select sx={{ height: 30, fontSize: 15}}
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   value={currValue.CompareType}
                   label="Comparison"
                   onChange={(e) => handleChangeSelect(e, 'CompareTypeSkill')}>
                {compareOptions.compareOptions.map(item => (  
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                   ))}
                </Select>
                </FormControl>

            <SearchIcon label="Cost" initalFilter={ props.init !== undefined &&  props.init !== null &&
            props.init.Value !== undefined && props.init.Value !== null ? props.init.Value: null}  
            FilterInit={filterInit.Value} UnInitFiler={() => nofilterInit('Cost')}
            clearfilter={props.clearfilterState} filterup={e => handleChangeSelect(e, 'Cost')}/>

             <FormControl sx={{ width: '40%', paddingLeft: '5px', paddingRight: '5px',
                   paddingTop: '10px'}}>
              <InputLabel sx={currValue.CompareType === null ?
                  {fontSize: 15}: 
                  {fontSize: 15, paddingTop: '10px'}}  id="demo-simple-select-label">Comparison</InputLabel>
               <Select sx={{ height: 30, fontSize: 15}}
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   value={currValue.CompareType}
                   label="Comparison"
                   onChange={(e) => handleChangeSelect(e, 'CompareTypeCost')}>
                {compareOptions.compareOptions.map(item => (  
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                   ))}
                </Select>
                </FormControl>

            
           <SearchIcon label="Uses" initalFilter={ props.init !== undefined &&  props.init !== null &&
            props.init.Value !== undefined && props.init.Value !== null ? props.init.Value: null}  
            FilterInit={filterInit.Value} UnInitFiler={() => nofilterInit('Uses')}
            clearfilter={props.clearfilterState} filterup={e => handleChangeSelect(e, 'Uses')}/>

             <FormControl sx={{ width: '40%', paddingLeft: '5px', paddingRight: '5px',
                   paddingTop: '10px'}}>
              <InputLabel sx={currValue.CompareType === null ?
                  {fontSize: 15}: 
                  {fontSize: 15, paddingTop: '10px'}}  id="demo-simple-select-label">Comparison</InputLabel>
               <Select sx={{ height: 30, fontSize: 15}}
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   value={currValue.CompareType}
                   label="Comparison"
                   onChange={(e) => handleChangeSelect(e, 'CompareTypeUses')}>
                {compareOptions.compareOptions.map(item => (  
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                   ))}
                </Select>
                </FormControl>

            {/* Need multi input for narrowing description ?? */}

            <button className="button-cancel-square" onClick={() => props.drop(currValue.Position)}>
                <DeleteSharpIcon />
            </button>
        </div>
        </>
    )
}
}

export default SpecialSkillsSearchField;

SpecialSkillsSearchField.propTypes = {
    drop: PropTypes.func,
    clearfilterState: PropTypes.bool,
    init: PropTypes.object,
    updateSearch: PropTypes.func,
    LoadingDone: PropTypes.func
}