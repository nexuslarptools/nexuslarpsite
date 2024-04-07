import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import usePutData from '../../utils/putdata'
import Loading from '../../components/loading/loading'
import LarpEditForm from '../../components/forms/larpeditform'

export default function LarpsEdit(props) {

    const [currdata, setCurrData] = useState()

    useEffect(() => {
        async function loadData () {

        if (props.data.larpsTagLockedTo !== null ) {
         await setCurrData({
            guid: props.data.guid,
            isactive: props.data.isactive,
            name: props.data.name,
            location: props.data.location,
            isPost: false
         })
        }
        else {
            await setCurrData({
                guid: props.data.guid,
                isactive: props.data.isactive,
                name: props.data.name,
                location: props.data.location,
                isPost: false
             })
        }
    
    }
loadData()
    }, [props.data])

    const SubmitForm = async (data) => {
        let bodyData = data
        bodyData.guid=currdata.guid

        await currTagMutation.mutate(bodyData)
        
        props.GoBack(true)
      }

      const currTagMutation = usePutData('/api/v1/Larps/' + props.data.guid, ['currLarpInfo', 'listLarpsWithGMs'])


return (
    
    <>
    { currdata === null || currdata === undefined ?
    <>
    <Loading />
    </> :
    <>
       <div>
        <LarpEditForm data={currdata} 
          title={'Edit LARP Information'}
          larpList={props.larpList} 
          GoBack={() => props.GoBack()} 
          SubmitForm={(data) => SubmitForm(data)} />
       </div>
       </>
    }
       </>

)}

LarpsEdit.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    larpList: PropTypes.array,
    selectedLARPOption: PropTypes.string
  }