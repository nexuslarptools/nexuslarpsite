import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Box, FormControl, InputLabel, MenuItem, Select, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Table } from 'reactstrap';
import './_searchdrawer.scss'
import { useEffect, useState } from 'react';
import CharacterSearchDrawer from '../forms/charactersearchdrawer';
import { useNavigate } from 'react-router-dom';

const SearchDrawer = props => {

    const navigate = useNavigate();
    const [formState, setformState] = useState({type: ''});
    const [trackingState, setTrackingState] = useState({
        type: '',
        Attribute: [{Attribute: null,
            CompareType: null,
            Value: null,
            AndOr: null,
            Position: 0,
            Loading: true}]
        });

      useEffect(() => { 
        let attribute = trackingState.Attribute
        trackingState.Attribute.forEach((element) => {
            element.Loading = true;
        });
        setTrackingState({
            ...trackingState,
            Attribute:attribute
        });
      }, [props.open]);

    const handleChange = async (e) => {
        await setformState({
            ...formState,
            type:e.target.value
        });
    };

    const updateSearchForm = async (e, name) => 
    {
        if (name !== 'Attribute')
        {
          await setformState({
              ...formState,
               [name]: e
          });

          await setTrackingState({
            ...trackingState,
             [name]: e
        });
        }
        else {

            let Attribute = [];
            let newstate = formState;
            newstate.OrAttributeSkillList = [];
            newstate.AndAttributeSkillList = [];
            if (trackingState.Attribute !== undefined && trackingState.Attribute !== null)
            {
                trackingState.Attribute.forEach((element, index) => {
                  if (index !== e.Position) {
                    Attribute.push(element);

                    if (element.AndOr === 'Or') {
                        newstate.OrAttributeSkillList.push(element);
                       }
                       else {
                        newstate.AndAttributeSkillList.push(element);
                       }
                  }
                  else 
                  {
                    Attribute.push(e);
                    if (e.AndOr === 'Or') {
                        newstate.OrAttributeSkillList.push(e);
                       }
                       else {
                        newstate.AndAttributeSkillList.push(e);
                       }
                  }


                });
            }

            await setTrackingState({
                ...trackingState,
                Attribute:Attribute
            });
            await setformState(
                newstate
            );
        }
    };

    const AddAttribute = async () => {
    let newAttribute ={
    Attribute: null,
    CompareType: null,
    Value: null,
    AndOr: 'And',
    Position: trackingState.Attribute.length,
    Loading:true
    };

    let attributes = trackingState.Attribute;
    attributes.push(newAttribute)

    await setTrackingState({
        ...trackingState,
        Attribute:attributes
    });
    }

    const dropattribute = async (e) => {
        
        let Attribute = [];
        let newstate = formState;
        newstate.OrAttributeSkillList = [];
        newstate.AndAttributeSkillList = [];
        if (trackingState.Attribute !== undefined && trackingState.Attribute !== null)
        {
            trackingState.Attribute.forEach((element, index) => {
              if (index < e) {
                element.Loading = true;
                Attribute.push(element);
              }
              if (index > e) {
                let newelement = element;
                newelement.Position = newelement.Position - 1;
                newelement.Loading = true;
                Attribute.push(newelement);
              }
              if (index !== e)
              {
                if (element.AndOr === 'Or') {
                    newstate.OrAttributeSkillList.push(element)
                }
                else {
                    newstate.AndAttributeSkillList.push(element)
                }
              }
            });
        }

        await setTrackingState({
            ...trackingState,
            Attribute:Attribute
        });
        await setformState(
            newstate
        );
    }

    const setDoneLoading = async (e, position) => {
        let attribute = trackingState.Attribute;

        attribute[position].Loading = !e;

        await setTrackingState({
            ...trackingState,
            Attribute:attribute
        });

    }

    const navigateout = async () => 
    {
        navigate('/'+formState.type+'search/', {state:
                formState
            })
        props.toggleClose(false)
    };
  
    return (
         <Drawer open={props.open} onClose={() => props.toggleClose(false)}>
         <Box sx={{ width: 500 }} role="presentation">
           <div className="selectionlist-label">
            Search
            </div>
            <div className="selectionlist-list">
           <TableContainer style={{
                maxHeight: window.innerHeight - 178 ,
              }}>
           <Table stickyHeader>
           <TableHead sx={{ position: 'sticky', top: 0, backgroundColor: 'white' }}>
           </TableHead>
           <TableRow>
            <TableCell>
     <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Type</InputLabel>
        <Select sx={{ width: 400 }}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={formState.type}
          label="Type"
          onChange={(e) => handleChange(e)} >
          <MenuItem value={'character'}>Character</MenuItem>
          <MenuItem value={'item'}>Item</MenuItem>
          </Select>
         </FormControl>
            </TableCell>
           </TableRow>
           {formState.type === 'character' ?
              <CharacterSearchDrawer init={trackingState}  updatesearch={(e, name) => updateSearchForm(e, name)}
              dropatribute={(e) => dropattribute(e)} AddAttribute={() => AddAttribute()}
              LoadingDone={(e, postion) => setDoneLoading(e, postion)}/>
            :
            <></>
            }
            </Table>
            </TableContainer>
            </div>
            <div className="selectionlist-footer">
            <button className="button-save" 
            onClick={() => navigateout()}
            disabled={formState.type === null ||  formState.type === ''}
            >Search</button>
            </div>
            </Box>
         </Drawer>
    )
}

export default SearchDrawer

SearchDrawer.propTypes = {
    open: PropTypes.bool,
    toggleClose: PropTypes.func,
    SuperSearch: PropTypes.func
  }