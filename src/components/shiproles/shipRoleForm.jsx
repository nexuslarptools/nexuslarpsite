
import { useEffect, useState } from "react"
import './_shipRoles.scss';
import ShipRoles from "./ShipRoles";
import PropTypes from "prop-types";
import Loading from "../loading/loading";
import useGetData from "../../utils/getdata";

const ShipRoleForm = props => {

         const [crewFormsState, setCrewForms] = useState({
          crewFormList: JSON.parse(
            JSON.stringify([{ arraynum: 0, visible: false,
        SelectedPosition:"",
        Position:"",
        DefaultCrew: "",
        Details:""}])
          ),
          showResult: false,
          usedroles: []
        });
    
        const [crewState, setCrew] = useState({
          crewList: JSON.parse(JSON.stringify([{ arraynum: 0, visible: true,
        SelectedPosition:"",
        Position:"",
        DefaultCrew: "",
        Details:""
           }])),
          showResult: false,
          usedroles: []
        });



useEffect(() => {
    initForm(props.initCrew)
   }, []);

   const initForm = (crew) => {
    if (crew !== undefined && crew !== null )
    {
          setCrew({
        ...crewState,
        crewList: crew.crewList,
        showResult:true
      });

        setCrewForms({
        ...crewState,
        crewList: crew.crewList,
        showResult:true
      });
    } else 
    {
        setCrew({
        ...crewState,
        showResult:true
      });

        setCrewForms({
        ...crewState,
        showResult:true
      });
    }
   }

        
    const addCrewForm = (e) => {
      e.preventDefault();

      const i = crewState.crewList.length;
      const newform = JSON.parse(JSON.stringify({
        arraynum: i,
        visible: true,
        SelectedPosition:"",
        Position:"",
        DefaultCrew: "",
        Details:""
      }));
      const newData = [];
      const usedRoles = [];
  
      for (let j = 0; j < i; j++) {
        newData.push(crewState.crewList[j]);
        if (crewState.crewList[j].SelectedPosition !== "Custom")
        {
          usedRoles.push(crewState.crewList[j].SelectedPosition)
        }
      }
  
      newData.push(newform);

      setCrew({
        ...crewState,
        crewList: newData,
        usedroles: usedRoles
      });
      setCrewForms({
        ...crewFormsState,
        crewFormList: newData,
        usedroles: usedRoles
      });

      props.updateCrew(newData);
    }

    const updateCrewForms = (rank, fieldname, value) => {
       const i = crewState.crewList.length;
       let newform = crewState.crewList[rank];
       newform[fieldname] = value;


      const newData = [];
      const usedRoles = [];

        for (let j = 0; j < i; j++) {
           if (j !== rank) {
           newData.push(crewState.crewList[j]);
             if (crewState.crewList[j].SelectedPosition !== "Custom") {
              usedRoles.push(crewState.crewList[j].SelectedPosition)
             }
           }
           else {
              newData.push(newform);
              if (newform.SelectedPosition !== "Custom") {
                usedRoles.push(newform.SelectedPosition)
              }
           }
        }  

      setCrew({
        ...crewState,
        crewList: newData,
        usedroles: usedRoles
      });
      setCrewForms({
        ...crewFormsState,
        crewFormList: newData,
        usedroles: usedRoles
      });

      props.updateCrew(newData);
    }

    const HideCrew = (rank) => {
      const i = crewState.crewList.length;
      const newData = [];
      const usedRoles = [];
  
      for (let j = 0; j < i; j++) {
           if (j !== rank) {
           newData.push(crewState.crewList[j]);
           newData[j].arraynum = j;
             if (crewState.crewList[j].SelectedPosition !== "Custom") {
              usedRoles.push(crewState.crewList[j].SelectedPosition)
             }
         }
      }

      setCrew({
        ...crewState,
        crewList: newData,
        usedroles: usedRoles
      });
      setCrewForms({
        ...crewFormsState,
        crewFormList: newData,
        usedroles: usedRoles
      });

      props.updateCrew(newData);
    }

        const UpCrew = (rank) => {
            if (rank <= crewState.crewList.length) {
                const newData = [];
                const usedRoles = [];
                for (let j = 0; j < crewState.crewList.length; j++) {
                  if (j === rank-1) {
                    newData.push(crewState.crewList[j+1]);
                    newData[j].arraynum = j;
                  if (crewState.crewList[j+1].SelectedPosition !== "Custom") {
                    usedRoles.push(crewState.crewList[j+1].SelectedPosition)
                   }
                    newData.push(crewState.crewList[j]);
                  if (crewState.crewList[j].SelectedPosition !== "Custom") {
                    usedRoles.push(crewState.crewList[j].SelectedPosition)
                   }
                   j++;
                   newData[j].arraynum = j;
                  } else {
                    newData.push(crewState.crewList[j]);
                    newData[j].arraynum = j;
                  if (crewState.crewList[j].SelectedPosition !== "Custom") {
                    usedRoles.push(crewState.crewList[j].SelectedPosition)
                  }
                  } 
           }
        setCrew({
        ...crewState,
        crewList: newData,
        usedroles: usedRoles
      });
      setCrewForms({
        ...crewFormsState,
        crewFormList: newData,
        usedroles: usedRoles
      });

        props.updateCrew(newData);
        }
        
    }

 const crewRolesQuery = useGetData('CrewRolesList', '/api/v1/ShipCrewList');
        
            if (crewRolesQuery.isLoading) return (
                <div>
                <Loading />
                </div>)
            if (crewRolesQuery.isError) return (
                  <div>
                  Error!
                  </div>)


if (!crewState.showResult || !crewFormsState.showResult) {
    <>
    <Loading />
    </>
} else {
return (
<>
    <div className='ship-sheet-crew'>
        {crewState.crewList.map((crew) => (
            <> <ShipRoles crewList={crewRolesQuery.data}  crew={crew} usedroles={crewState.usedroles}
                updateCrew={(rank, fieldname, value) => updateCrewForms(rank, fieldname, value)}
                HideCrew={(e) => HideCrew(e)} UpCrew={(e) => UpCrew(e)}
                /> </>
        ))}
        <button className="button-action add-another-ability" 
          onClick={(e) => addCrewForm(e)}>Add Another Crew</button>
    </div>
</>
)}
}

export default ShipRoleForm;

ShipRoleForm.propTypes = {
  updateCrew: PropTypes.function,
  initCrew:PropTypes.array
}