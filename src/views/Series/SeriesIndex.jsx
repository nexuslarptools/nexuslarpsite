import { useState } from 'react'
import { useGetData } from '../../utils/getdata'
import Loading from '../../components/loading/loading'
import authRedirect from '../../utils/authRedirect'
import SeriesTable from '../../components/tables/seriestable'
import SeriesCreate from './SeriesCreate'
import SeriesEdit from './SeriesEdit'
import AuthLevelInfo from '../../utils/authLevelInfo'


export default function SeriesIndex() {

    authRedirect(1)
    const authLevel = AuthLevelInfo()

    const [viewingCreateOrEdit, setViewingCreateOrEdit] = useState({
        isViewing: false,
        defaultInfo: null
    })

    const GoToNewEdit = (e) => {
        if (e === undefined || e === null) {
            setViewingCreateOrEdit({
                ...viewingCreateOrEdit,
                isViewing: true,
                defaultInfo: null
            })
        }
        else {
            const seriesInfo = seriesQuery.data.seriList.find((series) => series.guid === e)
            setViewingCreateOrEdit({
                ...viewingCreateOrEdit,
                isViewing: true,
                defaultInfo: seriesInfo
            })
        }
    }

    const MakeNewSeries = () => {
        setViewingCreateOrEdit({
            ...viewingCreateOrEdit,
            isViewing: true,
            defaultInfo: null
        })
    }

    const GoBack = () => {
        setViewingCreateOrEdit({
            ...viewingCreateOrEdit,
            isViewing: false,
            defaultInfo: null
        })
    }

    const seriesQuery = useGetData('listSeries', '/api/v1/Series/FullShortListWithTags');
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead'); 

    if (seriesQuery.isLoading || tagsQuery.isLoading) return (<div>
        <Loading />
        </div>)
      if (seriesQuery.isError || tagsQuery.isError) return (<div>
                Error!
                </div>)

    return (
        <>
        {viewingCreateOrEdit.isViewing === false ? 
        <>
        <SeriesTable data={seriesQuery.data} 
         tagsList={tagsQuery.data.find((taglist) => taglist.tagType === 'Series')}
         NewSeries={() => MakeNewSeries()} 
         GoToEdit={(e) => GoToNewEdit(e)}
         authLevel={authLevel}/>
        </> 
        : 
        <>
        { viewingCreateOrEdit.defaultInfo !== null ?
        <>
       <SeriesEdit GoBack={() => GoBack()} data={viewingCreateOrEdit.defaultInfo}  />
       </> :
        <>
      <SeriesCreate GoBack={() => GoBack()} data={viewingCreateOrEdit.defaultInfo} />
    </>} 
    </> }
        </>
    )
}