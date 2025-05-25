import PropTypes from 'prop-types';
import SearchIcon from '../icon/searchicon';
import { useEffect, useState } from 'react';


const CharacterSearchDrawer = props => {

    const [filterInit, setfilterInit] = useState(
        {
            Name: false,
            AlternateName: false
        }
    );
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (props.init !== undefined && props.init !== null) {
            let initobj = {}
            for (const key in props.init) {
                if (props.init[key] !== undefined && props.init[key] !== null) {
                    initobj[key] = true
                }
            }
            setfilterInit(initobj);
                setLoaded(true);       
             }}, []);

const nofilterInit = async(e) => {
    setfilterInit(
        { ...filterInit,
            [e]:false
        });

};
    
    return (
         loaded === true ?
        <>
        <SearchIcon label="Name"  initalFilter={props.init !== null &&
            props.init.Name !== undefined && props.init.Name !== null ? props.init.Name: null} 
            FilterInit={filterInit.Name} UnInitFiler={() => nofilterInit('Name')}
            clearfilter={props.clearfilterState} filterup={e => props.updatesearch(e, 'Name')}/>
        <SearchIcon label="Alternate Name" initalFilter={ props.init !== null &&
            props.init.AlternateName !== undefined && props.init.AlternateName !== null ? props.init.AlternateName: null}  
            FilterInit={filterInit.AlternateName} UnInitFiler={() => nofilterInit('AlternateName')}
            clearfilter={props.clearfilterState} filterup={e => props.updatesearch(e, 'AlternateName')}/>
        </> :
        <></>
    )
}

export default CharacterSearchDrawer

CharacterSearchDrawer.propTypes = {
    init: PropTypes.object,
    clearfilterState: PropTypes.bool,
    updatesearch: PropTypes.funct
  }