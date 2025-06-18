import { useEffect, useState } from 'react';
import Loading from '../loading/loading'
import './_specialskillssearchfield.scss'
import PropTypes from 'prop-types';
import compareOptions from './../../jsonfiles/compareoptions.json'
import powerOptions from '../../jsonfiles/powerOptions.json'
import GenericSearchField from './genericsearchfield';


const SpecialSkillsSearchField = (props) => {

        const [currValue, setCurrValue] = useState({
            Attribute: null,
            CompareType: null,
            Value: null,
            AndOr: 'And',
            Position: 0
        });

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
        <div className='specialSkills-box'>
          <GenericSearchField  
            compareOptions={compareOptions.compareOptions}
            formData={powerOptions.powerOptions}
            updateSearch={(e) => props.updateSearch(e)}
            LoadingDone={(e) => props.LoadingDone(e)}
            //drop={(e) => drop(e)}
            />
        </div>
        </>
    )
}
}

export default SpecialSkillsSearchField;

SpecialSkillsSearchField.propTypes = {
    drop: PropTypes.func,
    clearfilterState: PropTypes.bool,
    init: PropTypes.object,
    updateSearch: PropTypes.func,
    LoadingDone: PropTypes.func
}