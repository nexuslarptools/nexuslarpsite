import { useEffect, useState } from 'react';
import { FormLabel, InputLabel, MenuItem, Select } from '@mui/material';
import PropTypes from 'prop-types';

const LarpRoleAdder = props => {
  // states
  const [state, setState] = useState({
    larpsData: [],
    rolesData: [],
    visible: false
  });
  const [selections, setSelection] = useState({
    larpSelector: '',
    roleSelector: ''
  });

  // intialization of role select
  useEffect(() => {
    async function init () {
      setState({
        ...state,
        larpsData: props.larpData,
        rolesData: props.rolesData,
        visible: true
      });

      setSelection({
        ...selections,
        larpSelector: 'default',
        roleSelector: 'default'
      });
    }
    init();
  }, []);

  // update state w/ value when option is selected from dropdown
  const updateValue = (e) => {
    setSelection({
      ...selections,
      [e.target.name]: e.target.value
    });
    blurred(e);
  }

  // Add Role button - runs to add roles
  const sendToForm = (e) => {
    e.preventDefault();
    props.AddLarpRole(selections);
  }

  // handles select focus
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

  if (!state.visible) {
    return <div>Loading...</div>
  } else {
    return (
      <>
        <div className="input-pair">
                      <FormLabel htmlFor="LARP">Choose a LARP:</FormLabel>
                         <Select  key={'LARP'} 
                                label={'Select LARP'} 
                                variant="standard" 
                                type="input" 
                                id={'LARP'} 
                                defaultValue={ '' }
                                onChange={e => updateValue(e)} > 
                                              {state.larpsData.map((obj) => (
                        <MenuItem key={obj.name} value={obj.guid}>{obj.name}</MenuItem>))}
                         </Select>
          
        </div>
        <div className="input-pair">
          <InputLabel htmlFor="larproleadder">Choose a Role:</InputLabel>
          <select className={selections.roleSelector == 'default' ? 'selector roleSelector defaulted' : 'selector roleSelector'} name="roleSelector" 
            placeholder='select a role'
            value={selections.roleSelector}
            onChange={e => updateValue(e)}
            onFocus={(e) => focused(e, state.rolesData.length)}
            onBlur={(e) => blurred(e)}
            onKeyUp={(e) => e.code === "Escape" ? blurred(e) : null}
          > 
            <option className="select-default" key='default' value='default'>select a role</option>
            {state.rolesData.map((obj) => {
              return <option className={'Role'} key={obj.roleID} value={obj.roleID}>{obj.roleName}</option>
            })}
          </select>
        </div>
        <button id="edit-user-add-role" className="button-action" onClick={(e) => sendToForm(e)} 
          disabled={(selections.larpSelector !== 'default' && selections.roleSelector !== 'default' && selections.larpSelector !== undefined && selections.roleSelector !== undefined) ? false : true}>Add Role</button>
      </>
    )
  }
}

export default LarpRoleAdder;

LarpRoleAdder.propTypes = {
  larpData: PropTypes.array,
  rolesData: PropTypes.array,
  AddLarpRole: PropTypes.func
}