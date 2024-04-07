import { useEffect, useState } from 'react';
import { FormGroup, Input, FormLabel } from '@mui/material';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Loading from '../../components/loading/loading';

const ItemAbilites = props => {
  const [initstate, setInitState] = useState(true)
  const [updatestate, setUpdatestate] = useState(false)
  const [formState, setFormstate] = useState({
    arraynum: props.abilityState.arraynum,
    name: '',
    rank: '',
    energyCost: '',
    desc: '',
    visible: true,
    tags: [],
    initialTags: []
  })

  useEffect(() => {
    const controller = new AbortController();
    if (initstate) {
      if (props.abilityState.Special != null) {
        const initalTagSetup = [];
        props.abilityState.Special.Tags.forEach(tag => {
          props.itemTags.forEach(itemtag => {
            if (itemtag.guid === tag) {
              initalTagSetup.push(itemtag);
            }
          })
        })

        setFormstate({
          ...formState,
          name: props.abilityState.Special.Name,
          rank: props.abilityState.Special.Rank,
          energyCost: props.abilityState.Special.Cost,
          desc: props.abilityState.Special.Description,
          visible: true,
          tags: props.abilityState.Special.Tags,
          initialTags: initalTagSetup
        })
      }
      setInitState(false);
    }
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    }
  }, []);

  const updateItemTags = (e) => {
    const listguids = [];
    e.forEach(element => {
      listguids.push(element.guid)
    });
    setFormstate({
      ...formState,
      tags: listguids
    });
    setUpdatestate(true);
  }

  useEffect(() => {
    const controller = new AbortController();
    if (!initstate && updatestate) {
      props.onFillIn(formState);
    }
    setUpdatestate(false);
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    }
  }, [updatestate]);

  const handleChange = (e) => {
    setFormstate({
      ...formState,
      // Computed property names - keys of the objects are computed dynamically
      [e.target.name]: e.target.value
    });
    setUpdatestate(true);
  }

  if (initstate) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
      <>
        {
          props.abilityState.visible
            ? <>  
                <div className='power'>
                  <button className='button-cancel remove-ability' onClick={(e) => {e.preventDefault(); props.hideAbility(props.abilityState)}}>Remove Ability</button>
                  <FormGroup>
                    <div className='input-pair'>
                      <FormLabel>Ability Name:</FormLabel>
                      <Input type="text" name={'name'} key={'name ' + formState.arraynum} onChange={(e) => handleChange(e)} value={formState.name} />
                    </div>
                    <div className='input-pair'>
                      <FormLabel className="has-tooltip" title="Similar to the skills above, the number on a 0-7 scale that indicates their proficiency in this power.  Use the name of a Statistic or Skill to link it's value to that Satistic of Skill.">Skill Level:</FormLabel>
                      <Input type="text" name={'rank'} key={'rank ' + formState.arraynum} onChange={(e) => handleChange(e)} value={formState.rank} />
                    </div>
                    <div className='input-pair'>
                      <FormLabel>Energy Cost:</FormLabel>
                      <Input type="text" name={'energyCost'} key={'energyCost ' + formState.arraynum} onChange={(e) => handleChange(e)} value={formState.energyCost} />
                    </div>
                    <div className='input-pair power-description'>
                      <FormLabel>Description:</FormLabel>
                      <TextField multiline rows={5} type="text" name={'desc'} key={'desc ' + formState.arraynum} onChange={(e) => handleChange(e)} value={formState.desc} />
                    </div>
                    <div className='input-pair'>
                      <FormLabel>Tags:</FormLabel>
                      <Autocomplete
                        multiple
                        id={'multiple-limit-tags' + formState.arraynum}
                        defaultValue={formState.initialTags}
                        options={props.itemTags}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, val) => updateItemTags(val)}
                        renderInput={(params) => (
                          <TextField placeholder="choose tags" {...params} />
                        )}
                      />
                    </div>
                  </FormGroup>     
                </div>
              </>
            : <div></div> 
        }
      </>
    )
  }
}

export default ItemAbilites;

ItemAbilites.propTypes = {
  abilityState: PropTypes.object,
  itemTags: PropTypes.array,
  onFillIn: PropTypes.func,
  hideAbility: PropTypes.func
}