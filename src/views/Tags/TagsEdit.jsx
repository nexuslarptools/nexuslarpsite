import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TagEditForm from '../../components/forms/tageditform'
import usePutData from "../../utils/putdata"
import Loading from '../../components/loading/loading'

export default function TagsEdit(props) {

    const [currdata, setCurrData] = useState()

    useEffect(() => {
        async function loadData () {

        if (props.data.larpsTagLockedTo !== null ) {
         await setCurrData({
            guid: props.data.guid,
            isactive: props.data.isactive,
            isLocked: props.data.isLocked,
            name: props.data.name,
            tagtypeguid: props.data.tagtypeguid,
            isPost: false,
            larpGuid: props.data.larpsTagLockedTo[0].guid,
            larpName: props.data.larpsTagLockedTo[0].name
         })
        }
        else {
            await setCurrData({
                guid: props.data.guid,
                isactive: props.data.isactive,
                isLocked: props.data.isLocked,
                name: props.data.name,
                tagtypeguid: props.data.tagtypeguid,
                isPost: false,
                larpGuid: '',
                larpName: ''
             })
        }
    
    }
loadData()
    }, [props.data])

    const SubmitForm = async (data) => {
        let bodyData = data
        const larpguid = []
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
          larpguid.push(data.larptagGuid)
        }
        bodyData.larptagGuid=larpguid
        bodyData.guid=currdata.guid

        await currTagMutation.mutate(bodyData)
        
        props.GoBack(true)
      }

      const currTagMutation = usePutData('/api/v1/Tags/' + props.data.guid, ['currTagInfo', 'listTags'])


return (
    
    <>
    { currdata === null || currdata === undefined ?
    <>
    <Loading />
    </> :
    <>
    <div className="entryForm">
       <header className="header">Edit Tag</header>
        <TagEditForm data={currdata} 
          larpList={props.larpList} 
          dropDownArray={props.dropDownArray} 
          GoBack={() => props.GoBack()} 
          SubmitForm={(data) => SubmitForm(data)} />
       </div>
       </>
    }
       </>

)}

TagsEdit.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    larpList: PropTypes.array,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string
  }