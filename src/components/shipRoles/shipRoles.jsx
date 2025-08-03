import { useEffect, useState } from "react"
import Loading from "../loading/loading"
import { Autocomplete, FormGroup, FormLabel, Input, TextField } from "@mui/material"
import './_shipRoles.scss';
import PropTypes from "prop-types";
import { ArrowDownwardSharp, ArrowUpwardSharp } from "@mui/icons-material";

const ShipRoles = props => {
  const [initstate, setInitState] = useState(true)

  const [roleState, setRoleState] = useState({
    arraynum:0,
    SelectedPosition:"",
    Position:"",
    DefaultCrew: "",
    Details:""
  })

const initForm = async (crewRole) => {
  await setRoleState(crewRole);
  await setInitState(false);
}

useEffect(() => {
    initForm(props.crew)
   }, [props.crew])


  const changePosition = async (e) => {

    if (e.Position !== "Custom") {
     props.updateCrew(roleState.arraynum, "SelectedPosition", e.position);
     props.updateCrew(roleState.arraynum, "Position", e.position);
     props.updateCrew(roleState.arraynum, "Details", props.crewList.roles[props.crewList.roles.indexOf(e)].description);
    }
    else {
     props.updateCrew(roleState.arraynum, "SelectedPosition", e.position);
     props.updateCrew(roleState.arraynum, "Position", "");
     props.updateCrew(roleState.arraynum, "Details", "");
    
    }
  }

   const handleChange = async (e) => {
   props.updateCrew(roleState.arraynum, e.target.name, e.target.value)
  }

  const posindex = props.crewList.roles.findIndex(role => role.position === props.crew.SelectedPosition);

  if (initstate) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
        <>
         <div className='crewposition'>
        <FormGroup>
         <div className='input-pair'>
        <FormLabel>Crew Position:</FormLabel>
        <Autocomplete
          id={'Select-role' + roleState.arraynum}
                options={props.crewList.roles}
                getOptionLabel={(option) => option.position}
                onChange={(event, val) => changePosition(val)}
                renderInput={(params) => <TextField placeholder="Choose Crew Position" {...params} />}
                value={ posindex < 0 ? 
                    null :
                    props.crewList.roles[posindex]} />
          </div>
          {roleState.SelectedPosition === "Custom" ?
            <div className='input-pair'>
            <FormLabel>Name of Custom Position:</FormLabel>
            <Input type="text" name={'Position'} 
              key={'Position ' + roleState.arraynum} 
              onChange={(e) => handleChange(e)} 
               //value={props.Position !== null? props.Position:''}
             />
            </div>
            :  roleState.SelectedPosition === "Captain" ?
              <div className='input-pair'>
            <FormLabel>Default Captain:</FormLabel>
            <Input type="text" name={'DefaultCrew'} 
              key={'DefaultCrew ' + roleState.arraynum} 
              onChange={(e) => handleChange(e)}  />
        </div> : <div></div>
         }
           <div>
           <button className='button-cancel remove-ability' onClick={(e) => {e.preventDefault(); props.HideCrew(roleState.arraynum)}}>Remove Crew</button>
           <div className='button-action reorder-ability'  onClick={(e) => {e.preventDefault(); props.UpCrew(roleState.arraynum +1)}}>
            <ArrowDownwardSharp />
            </div>
             <div className='button-action reorder-ability'  onClick={(e) => {e.preventDefault(); props.UpCrew(roleState.arraynum)}}>
            <ArrowUpwardSharp />
            </div>
            </div>
        <div className='input-pair power-description'>
          <FormLabel>Description:</FormLabel>
          <TextField multiline rows={5} type="text" name={'Details'} key={'Details ' +  roleState.arraynum} onChange={(e) => handleChange(e)} 
          value={roleState.Details !== null ? roleState.Details:''} 
          />
        </div>
         </FormGroup>
         </div>
        </>
    )
  }
}

export default ShipRoles;

ShipRoles.propTypes = {
  crew: PropTypes.object,
  usedroles: PropTypes.array,
  updateCrew: PropTypes.function,
  HideCrew:  PropTypes.function,
  UpCrew:  PropTypes.function,
  crewList: PropTypes.object
}