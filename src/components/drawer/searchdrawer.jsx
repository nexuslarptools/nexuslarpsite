import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Box, FormControl, InputLabel, MenuItem, Select, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Table } from 'reactstrap';
import './_searchdrawer.scss'
import { useState } from 'react';
import CharacterSearchDrawer from '../forms/charactersearchdrawer';
import { useNavigate } from 'react-router-dom';

const SearchDrawer = props => {

    const navigate = useNavigate();
    const [formState, setformState] = useState(
        {type: ''});

    const handleChange = async (e) => {
        await setformState({
            ...formState,
            type:e.target.value
        });
    };

    const updateSearchForm = async (e, name) => 
    {
        await setformState({
            ...formState,
             [name]: e
        });
    };

    const navigateout = async () => 
    {
        navigate('/'+formState.type+'search/', {state:
                formState
            })
    };
  
    return (
        <>
         <Drawer open={props.open} onClose={() => props.toggleClose(false)}>
         <Box sx={{ width: 500 }} role="presentation">
           <div className="selectionlist-label">
            Search
            </div>
            <div className="selection-list-list">
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
          onChange={(e) => handleChange(e)}
          >
          <MenuItem value={'character'}>Character</MenuItem>
          <MenuItem value={'item'}>Item</MenuItem>
          </Select>
         </FormControl>
            </TableCell>
           </TableRow>
           {formState.type === 'character' ?
              <CharacterSearchDrawer init={formState}  updatesearch={(e, name) => updateSearchForm(e, name)}/>
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
      </>
    )
}

export default SearchDrawer

SearchDrawer.propTypes = {
    open: PropTypes.bool,
    toggleClose: PropTypes.funct,
    SuperSearch: PropTypes.funct
  }