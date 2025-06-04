import { useEffect, useState } from 'react';
import SearchIcon from '../icon/searchicon';
import PropTypes from 'prop-types';
import Loading from '../loading/loading';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp';
import './_attributesearchfield.scss';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const GenericSearchField = (props) => {
    const [currValue, setCurrValue] = useState({
        Attribute: null,
        CompareType: null,
        Value: null,
        AndOr: 'And',
        Position: 0,
        NumericCompare: false
    })

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
          [fieldname]: e.target.value,
          NumericCompare: props.formData.find(item => item.value === newval.Attribute).NumericCompare
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
        <div>
        <div className='attribute-fieldtext'>
          <FormControl sx={{ width: '38%', paddingLeft: '5px', paddingRight: '5px',
          paddingTop: '10px'}}>
        <InputLabel  sx={currValue.Attribute === null || currValue.Attribute === '' ?
        {fontSize: 15}: 
        {fontSize: 15, paddingTop: '10px'}} 
         id="demo-simple-select-label">Attribute</InputLabel>
             <Select sx={{ height: 30, fontSize: 15}}
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   value={currValue.Attribute}
                   label="Attribute"
                   onChange={(e) => handleChangeSelect(e, 'Attribute')}>
                {props.formData.map(item => (  
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                   ))}
                </Select>
                </FormControl>

                <FormControl sx={{ width: '40%', paddingLeft: '5px', paddingRight: '5px',
                   paddingTop: '10px'}}>
              <InputLabel sx={currValue.CompareType === null || currValue.CompareType === '' ?
                  {fontSize: 15}: 
                  {fontSize: 15, paddingTop: '10px'}}  
                   id="demo-simple-select-label">Comparison</InputLabel>
               <Select sx={{ height: 30, fontSize: 15}}
                   labelId="demo-simple-select-label"
                   id="demo-simple-select"
                   value={currValue.CompareType}
                   label="Comparison"
                   onChange={(e) => handleChangeSelect(e, 'CompareType')}>
                {props.compareOptions.filter(item => !item.display.includes('Numeric')
                || currValue.NumericCompare).map(item => (  
                  <MenuItem key={item.value} value={item.value}>{item.display}</MenuItem>
                   ))}
                </Select>
                </FormControl>

                <input type="checkbox" 
                          checked={checked}
                          onChange={() => handleChangeSelect(checked, 'AndOr')} />
                  <div className='attribute-wrapbox'>
                 Value MUST be present
                 </div>
          </div>

          <div className='search-and-delete-row'>
          <SearchIcon label="Search Value" initalFilter={ props.init !== undefined &&  props.init !== null &&
            props.init.Value !== undefined && props.init.Value !== null ? props.init.Value: null}  
            FilterInit={filterInit.Value} UnInitFiler={() => nofilterInit('Value')}
            clearfilter={props.clearfilterState} filterup={e => handleChangeSelect(e, 'Value')}/>

            <button className="button-cancel-square" onClick={() => props.drop(currValue.Position)}>
                <DeleteSharpIcon />
            </button>
            </div>
        </div>
        </>
    )
  }
}

export default GenericSearchField;

GenericSearchField.propTypes = {
    init: PropTypes.object,
    clearfilterState: PropTypes.bool,
    updateSearch: PropTypes.func,
    drop: PropTypes.func,
    LoadingDone: PropTypes.func,
    reinit: PropTypes.bool,
    formData: PropTypes.array,
    compareOptions: PropTypes.array
}