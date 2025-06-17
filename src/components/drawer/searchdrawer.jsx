import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Box, FormControl, InputLabel, MenuItem, Select, TableCell, TableContainer, 
  TableHead, TableRow } from '@mui/material';
import { Table } from 'reactstrap';
import './_searchdrawer.scss'
import { useEffect, useState } from 'react';
import CharacterSearchDrawer from '../forms/charactersearchdrawer';
import { useNavigate } from 'react-router-dom';
import useGetData from '../../utils/getdata';
import ItemSearchDrawer from '../forms/itemsearchdrawer';

const SearchDrawer = props => {

    const navigate = useNavigate();

    const allTagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead');

    const [formState, setformState] = useState({type: ''});
    const [trackingState, setTrackingState] = useState({
        type: '',
        Attribute: [],
        SpecialSkill: [],
        AndTags:[],
        OrTags:[],
        ItemType: ''
        });

      useEffect(() => { 
        let attribute = trackingState.Attribute
        attribute.forEach((element) => {
            element.Loading = true;
        });
        let skill = trackingState.SpecialSkill
        trackingState.SpecialSkill.forEach((element) => {
            element.Loading = true;
        });

        setTrackingState({
            ...trackingState,
            Attribute:attribute,
            SpecialSkill:skill
        });
      }, [props.open]);

    const handleChange = async (e) => {
        await setformState({
            type:e.target.value
        });

        await setTrackingState({
        type: '',
        Attribute: [],
        SpecialSkill: [],
        AndTags:[],
        OrTags:[],
        ItemType: ''
        });

    };

    const updateSearchForm = async (e, name) => 
    {
        if (name !== 'Attribute' && name !== 'SpecialSkill' )
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

            if (trackingState[name] !== undefined && trackingState[name] !== null)
                {
                    trackingState[name].forEach((element, index) => {
                      if (index !== e.Position) {
                        Attribute.push(element);
                      }
                      if (index === e.Position) {
                        let newelement = e;
                        newelement.Loading = true;
                        Attribute.push(newelement);
                      }
                    });
                }

            await setTrackingState({
                ...trackingState,
                [name]:Attribute
            });
        }
    };


    const AddAttribute = async (e) => {
    let newAttribute ={
    Attribute: '',
    CompareType: '',
    Value: null,
    AndOr: 'And',
    Position: trackingState[e].length,
    Loading:true
    };

    let attributes = trackingState[e];
    attributes.push(newAttribute)

    await setTrackingState({
        ...trackingState,
        [e]:attributes
    });
    }

    const dropattribute = async (position, type) => {
        
        let Attributelist = [];
        trackingState[type].forEach((element, index) => {
            if (index !== position) {
                if (index > position) {
                element.Position = index-1;
                }

                Attributelist.push(element)
            }
        });
          await setTrackingState({
              ...trackingState,
              [type]:Attributelist
          });
    }

    const createSearchJSON =() => {
       let results ={}
        for (const key of Object.keys(trackingState)) {
          if (key !== 'Attribute' && key !== 'SpecialSkill' && key !== 'AndTags' 
            && key !== 'OrTags'
           ) {
            results[key] = trackingState[key]
          }
          else {
            if (key === 'Attribute') {
                results.OrAttributeSkillList = [];
                results.AndAttributeSkillList = [];
                if (trackingState.Attribute !== undefined && trackingState.Attribute !== null) {
                    trackingState.Attribute.forEach(element => {
                      if (element.AndOr === 'Or') {
                             results.OrAttributeSkillList.push(element);
                           }
                           else {
                            results.AndAttributeSkillList.push(element);
                           }
                    });
                }

            }
            if (key === 'SpecialSkill') {
                results.OrSpecialSkillList = [];
                results.AndSpecialSkillList = [];
                if (trackingState.SpecialSkill !== undefined && trackingState.SpecialSkill !== null) {
                    trackingState.SpecialSkill.forEach(element => {
                        let superElement = {[element.Attribute]:element}
                        if (element.Attribute === 'Description')
                            {
                              let newdescarray = []
                              newdescarray.push(element)
                              superElement = {[element.Attribute]:newdescarray}
                            }
                      if (element.AndOr === 'Or') {
                             results.OrSpecialSkillList.push(superElement);
                           }
                           else {
                            results.AndSpecialSkillList.push(superElement);
                           }
                    });
                }
            }
            if(key === 'AndTags') {
               results.AndTagsList = [];
              if (trackingState.AndTags !== undefined && trackingState.AndTags !== null) {
                    trackingState.AndTags.forEach(element => {
                      results.AndTagsList.push(element.guid);
                    });
            }
          }
            if(key === 'OrTags') {
              results.OrTagsList = [];
                  if (trackingState.OrTags !== undefined && trackingState.OrTags !== null) {
                    trackingState.OrTags.forEach(element => {
                      results.OrTagsList.push(element.guid);
                    });
            }
        }
        }
      }
       return results;
    }

    const setDoneLoading = async (e, position, type) => {
        let attribute = trackingState[type];
        attribute[position].Loading = !e;
        await setTrackingState({
            ...trackingState,
            [type]:attribute
        });
    }

    const navigateout = async () => 
    {
        navigate('/'+formState.type+'search/', {state:
                createSearchJSON()
            })
        props.toggleClose(false)
    };

        if (allTagsQuery.isLoading) 
            return (<></>)
  
    return (
        <>
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
           {allTagsQuery.isError ?  <div>Error Returning Tag Data</div> :  formState.type === 'character' ?
              <CharacterSearchDrawer init={trackingState}  updatesearch={(e, name) => updateSearchForm(e, name)}
              tagslist={allTagsQuery.data}
              dropatribute={(e, f) => dropattribute(e, f)} AddAttribute={(e) => AddAttribute(e)}
              LoadingDone={(e, postion, type) => setDoneLoading(e, postion, type)}/>
            :
            formState.type === 'item' ?
              <ItemSearchDrawer init={trackingState}  updatesearch={(e, name) => updateSearchForm(e, name)}
              tagslist={allTagsQuery.data}
              dropatribute={(e, f) => dropattribute(e, f)} AddAttribute={(e) => AddAttribute(e)}
              LoadingDone={(e, postion, type) => setDoneLoading(e, postion, type)}/>
            :
            <></>
            }
            </Table>
            </TableContainer>
            </div>
            <div className="selectionlist-footer">
            <button className="button-save" 
              onClick={() => navigateout()}
              disabled={formState.type === null ||  formState.type === ''}>
                Search
                </button>
             </div>
            </Box>
         </Drawer>
      </>
    )
}

export default SearchDrawer

SearchDrawer.propTypes = {
    open: PropTypes.bool,
    toggleClose: PropTypes.func,
    SuperSearch: PropTypes.func
  }