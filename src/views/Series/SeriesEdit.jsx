import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { v4 } from 'uuid';
import Loading from '../../components/loading/loading'
import SeriesEditForm from '../../components/forms/serieseditform';
import useGetData from '../../utils/getdata';
import usePutData from "../../utils/putdata";


export default function SeriesEdit(props) {

    const [currdata, setCurrData] = useState()

    useEffect(() => {
        async function loadData () {
 let isData = props.data
 isData.isPost = false
         await setCurrData(isData)
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
        bodyData.guid = props.data.guid;

        await currSeriesMutation.mutate(bodyData)

        props.GoBack(true)
      }

      const currSeriesMutation = usePutData('/api/v1/Series/' + props.data.guid, ['currSeriesInfo', 'listSeries'])
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
       <div className="entryForm edit-series">
        <SeriesEditForm 
        title={'Edit Series'}
        data={currdata} 
          tagsList={tagsQuery.data.find((elements) => elements.tagType==='Series')}
          GoBack={() => props.GoBack()} 
          SubmitForm={(data) => SubmitForm(data)} />
       </div>
       </>
    }
       </>

)}

SeriesEdit.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    larpList: PropTypes.array,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string
  }