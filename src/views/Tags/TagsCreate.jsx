import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import TagEditForm from '../../components/forms/tageditform'
import PostData from "../../utils/postdata"
import { v4 } from 'uuid';
import Loading from '../../components/loading/loading'


export default function TagsCreate(props) {

    const [currdata, setCurrData] = useState()

    useEffect(() => {
        async function loadData () {
 
         await setCurrData( {
            isactive: true,
            isLocked: false,
            name: '',
            tagtypeguid: null,
            larpName: '',
            larpGuid: '',
            isPost: true
            })
   
}
loadData()
    }, [props.data])

    const SubmitForm = async (data) => {
        let bodyData = data
        const larpguid = []
        larpguid.push(data.larptagGuid)
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
        bodyData.larptagGuid=larpguid
        }
        bodyData.guid = v4()

        await newTagMutation.mutate(bodyData)

        props.GoBack(true)
      }

      const newTagMutation = PostData('/api/v1/Tags', ['newTag', 'listTags'])


return (
    
    <>
    { currdata === null || currdata === undefined ?
    <>
    <Loading />
    </> :
    <>
      <div className="entryForm">
       <header className="header">Create New Tag</header>
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

TagsCreate.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    larpList: PropTypes.array,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string
  }