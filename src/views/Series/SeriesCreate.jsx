import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PostData from "../../utils/postdata"
import { v4 } from 'uuid';
import Loading from '../../components/loading/loading'
import SeriesEditForm from '../../components/forms/serieseditform';
import useGetData from '../../utils/getdata';


export default function SeriesCreate(props) {

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

        await newSeriesMutation.mutate(bodyData)

        props.GoBack(true)
      }

      const newSeriesMutation = PostData('/api/v1/Series', ['newSeries', 'listSeries'])
      const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead') 

      if (tagsQuery.isLoading) return (<div>
        <Loading />
        </div>)
      if (tagsQuery.isError ) return (<div>
                Error!
                </div>)


return (
    
    <>
    { currdata === null || currdata === undefined ?
    <>
    <Loading />
    </> :
    <>
       <div>
        <SeriesEditForm 
        title={'Create New Series'}
        data={currdata} 
          tagsList={tagsQuery.data.find((elements) => elements.tagType==='Series')}
          GoBack={() => props.GoBack()} 
          SubmitForm={(data) => SubmitForm(data)} />
       </div>
       </>
    }
       </>

)}

SeriesCreate.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string
  }