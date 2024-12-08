import { useEffect, useState } from 'react';
import { FormGroup, Input, FormLabel } from '@mui/material';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Loading from '../../components/loading/loading';
import { ArrowCircleUpRounded, ArrowDownwardSharp, ArrowUpwardSharp } from '@mui/icons-material';

const ItemAbilites = props => {
  const [initstate, setInitState] = useState(true)
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
        if (props.abilityState.Special.Tags !== null) {
        props.abilityState.Special.Tags.forEach(tag => {
          props.itemTags.forEach(itemtag => {
            if (itemtag.guid === tag) {
              initalTagSetup.push(itemtag);
            }
          })
        })
      }

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

  const updateItemTags = async (e) => {
    const listguids = [];
    e.forEach(element => {
      listguids.push(element.guid)
    });
    props.onFillIn(formState.arraynum, 'Tags' ,listguids);
  }

  const handleChange = async (e) => {
    props.onFillIn(formState.arraynum, e.target.name, e.target.value);
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
                  <div className='button-action reorder-ability'  onClick={(e) => {e.preventDefault(); props.DownAbility(props.abilityState.arraynum)}}>
                  <ArrowDownwardSharp />
                  </div>
                  <div className='button-action reorder-ability'  onClick={(e) => {e.preventDefault(); props.UpAbility(props.abilityState.arraynum)}}>
                  <ArrowUpwardSharp />
                  </div>
                  <FormGroup>
                    <div className='input-pair'>
                      <FormLabel>Ability Name:</FormLabel>
                      <Input type="text" name={'Name'} key={'Name ' +  props.abilityState.arraynum} onChange={(e) => handleChange(e)} value={props.abilityState.Name} />
                    </div>
                    <div className='input-pair'>
                      <FormLabel className="has-tooltip" title="Similar to the skills above, the number on a 0-7 scale that indicates their proficiency in this power.  Use the name of a Statistic or Skill to link it's value to that Satistic of Skill.">Skill Level:</FormLabel>
                      <Input type="text" name={'Rank'} key={'Rank ' + props.abilityState.arraynum} onChange={(e) => handleChange(e)} value={props.abilityState.Rank} />
                    </div>
                    <div className='input-pair'>
                      <FormLabel>Energy Cost:</FormLabel>
                      <Input type="text" name={'Cost'} key={'Cost ' + props.abilityState.arraynum} onChange={(e) => handleChange(e)} value={props.abilityState.Cost} />
                    </div>
                    <div className='input-pair power-description'>
                      <FormLabel>Description:</FormLabel>
                      <TextField multiline rows={5} type="text" name={'Description'} key={'Description ' + props.abilityState.arraynum} onChange={(e) => handleChange(e)} value={props.abilityState.Description} />
                    </div>
                    <div className='input-pair'>
                      <FormLabel>Tags:</FormLabel>
                      <Autocomplete
                        multiple
                        id={'multiple-limit-tags' + props.abilityState.arraynum}
                        defaultValue={props.abilityState.initialTags}
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
  hideAbility: PropTypes.func,
  DownAbility: PropTypes.func,
  UpAbility: PropTypes.func
}