import formJSON from '../../jsonfiles/characterinput.json';
import { useEffect, useState } from 'react';
import SearchIcon from '../icon/searchicon';
import PropTypes from 'prop-types';
import Loading from '../loading/loading';
import DeleteSharpIcon from '@mui/icons-material/DeleteSharp'

const AttributeSearchField = (props) => {

    const compareOptions = [
        {value: 'Equals', display:'Equals (Numeric)'},
        {value: 'LessThan', display:'< (Numeric)'},
        {value: 'LessThanEqual', display:'<= (Numeric)'},
        {value: 'GreaterThan', display:'> (Numeric)'},
        {value: 'GreaterThanEqual', display:'>= (Numeric)'},
        {value: 'ExactEquals', display:'Exact Match'},
        {value: 'Contains', display:'Contains Text'},
        {value: 'StartsWith', display:'Starts With'},
        {value: 'EndsWith', display:'Ends With'}
    ]

    const [currValue, setCurrValue] = useState({
        Attribute: null,
        CompareType: null,
        Value: null,
        AndOr: 'And',
        Position: 0
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

            // handles dropdown focus
            const focused = (e, length) => {
                if (length+1 > 6) {
                  e.target.size = 6;
                }
                else {
                  e.target.size = length+1;
                }
              }
              const blurred = (e) => {
                e.target.size = 1;
                e.target.blur();
              }

    const formData = [];
        for (const key of Object.keys(formJSON)) {
          for (const subkey of Object.keys(formJSON[key].Values)) {
            const jsonItem = {
              Label: formJSON[key].Values[subkey].Label,
              Type: formJSON[key].Values[subkey].Type,
              Required: formJSON[key].Values[subkey].Required,
              ToolTip: formJSON[key].Values[subkey].ToolTip,
              Name: subkey,
              Limit: formJSON[key].Values[subkey].Limit,
              Types: formJSON[key].Values[subkey].Types,
              enums: formJSON[key].Values[subkey].enums,
              inDropDown: formJSON[key].Values[subkey].InDropDown,
            }
            if(jsonItem.inDropDown) {
            formData.push(jsonItem);
            }
          }
        }


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
        <div>
          {/* <Select
            labelId="demo-simple-select-label"
             id="demo-simple-select"
             value={currValue}
             label="Attribute"
             onChange={(e) => handleChangeSelect(e)}>
                {
                formData.map((item) => 
                  <MenuItem key={item.Label} value={item.Label}>{item.Label}</MenuItem>)}
             </Select> */}

             <select 
              value={currValue.Attribute}
              onChange={(e) => handleChangeSelect(e, 'Attribute')}
              onFocus={(e) => focused(e, formData.length)}
              onBlur={(e) => blurred(e)}
              onKeyUp={(e) => e.code === "Escape" ? blurred(e) : null}>
              {formData.map((item) => {
                return (
                  <>
                    { <option className={'tagtype'} key={item.Name} value={item.Name}>
                        {item.Label}
                      </option>
                    }
                  </>
                )
              })}
            </select>

            <select 
              value={currValue.CompareType}
              onChange={(e) => handleChangeSelect(e, 'CompareType')}
              onFocus={(e) => focused(e, compareOptions.length)}
              onBlur={(e) => blurred(e)}
              onKeyUp={(e) => e.code === "Escape" ? blurred(e) : null}>
              {compareOptions.map((item) => {
                return (
                  <>
                    { <option className={'tagtype'} key={item.value} value={item.value}>
                        {item.display}
                      </option>
                    }
                  </>
                )
              })}
            </select>

            <label>
                <input type="checkbox" 
                          checked={checked}
                          onChange={() => handleChangeSelect(checked, 'AndOr')} />
                 Value MUST be present
            </label>

          <SearchIcon label="Search Value" initalFilter={ props.init !== undefined &&  props.init !== null &&
            props.init.Value !== undefined && props.init.Value !== null ? props.init.Value: null}  
            FilterInit={filterInit.Value} UnInitFiler={() => nofilterInit('Value')}
            clearfilter={props.clearfilterState} filterup={e => handleChangeSelect(e, 'Value')}/>

            <button className="button-cancel-square" onClick={() => props.drop(currValue.Position)}>
                <DeleteSharpIcon />
            </button>

        </div>
        </>
    )
  }
}


export default AttributeSearchField;

AttributeSearchField.propTypes = {
    init: PropTypes.object,
    updatesearch: PropTypes.func,
    clearfilterState: PropTypes.bool,
    updateSearch: PropTypes.func,
    drop: PropTypes.func,
    LoadingDone: PropTypes.func,
    reinit: PropTypes.bool,
}