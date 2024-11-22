import { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import PostData from "../../utils/postdata"
import { v4 } from 'uuid';
import Loading from '../../components/loading/loading'
import useGetData from '../../utils/getdata';
import ItemEditForm from '../../components/forms/itemeditform';
import uploadToS3 from '../../utils/s3';


export default function ItemCreate(props) {

    const [currdata, setCurrData] = useState();
    const [characterInitState, setCharacterInitState] = useState({
      showResult: null,
      apiMessage: null
    });


    const initForm = (formJSON) => {
      const formData = [];
  
      for (const key of Object.keys(formJSON)) {
        const sectionData = [];
        for (const subkey of Object.keys(formJSON[key].Values)) {
          const jsonItem = {
            Label: formJSON[key].Values[subkey].Label,
            Type: formJSON[key].Values[subkey].Type,
            Required: formJSON[key].Values[subkey].Required,
            ToolTip: formJSON[key].Values[subkey].ToolTip,
            Name: subkey,
            Limit: formJSON[key].Values[subkey].Limit,
            Types: formJSON[key].Values[subkey].Types,
            enums: formJSON[key].Values[subkey].enums,
          }
          sectionData.push(jsonItem);
        }
        const section = {
          Heading: formJSON[key].Heading,
          Types: formJSON[key].Types,
          Values: sectionData,
          IsdoubleSide: formJSON[key].IsdoubleSide
        }
        formData.push(section);
      }
      return formData;
    }

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

    const SubmitForm = async (data, filelocation) => {
        let bodyData = data
        const larpguid = []
        larpguid.push(data.larptagGuid)
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
        bodyData.larptagGuid=larpguid
        }
        bodyData.guid = v4()
        bodyData.Img1 = bodyData.guid + '.jpg';

        if (filelocation !== null)
        {
          await uploadToS3('images/Items/' + bodyData.Img1, filelocation)
        }

        await newItemMutation.mutate(bodyData)

        props.GoBack(true)
      }

    const newItemMutation = PostData('/api/v1/ItemSheets', ['newItem', 'listUnapprovedItems'])
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead') 
    const seriesQuery = useGetData('listSeriesShort', '/api/v1/Series/ShortList') 

    const TagsFilter = (response)  => {

        const chartagsResult = [];
        const abilitytagsResult = [];
        const larpRuntagsResult = [];
        response.forEach(element => {
          if (element.tagType === 'Item') {
            element.tagsList.forEach(tag => {
              chartagsResult.push(tag)
            });
          }
          if (element.tagType === 'Ability') {
            element.tagsList.forEach(tag => {
              abilitytagsResult.push(tag)
            });
          }
          if (element.tagType === 'LARPRun') {
            element.tagsList.forEach(tag => {
              larpRuntagsResult.push(tag)
              chartagsResult.push(tag)
            });
          }
        })

        return {     
          characterTags: chartagsResult,
          abilityTags: abilitytagsResult,
          LARPRun: larpRuntagsResult
        }
      }

      const TagsFilterLARP = (response)  => {

        const larpRuntagsResult = [];
        response.forEach(element => {
          if (element.tagType === 'LARPRun') {
            element.tagsList.forEach(tag => {
              larpRuntagsResult.push(tag)
            });
          }
        })

        return {larpRuntagsResult}
      }

    if (tagsQuery.isLoading || seriesQuery.isLoading) return (<div>
      <Loading />
      </div>)
    if (tagsQuery.isError || seriesQuery.isError ) return (<div>
              Error!
              </div>)


    return (
        <>
        <ItemEditForm formJSON={initForm(props.formJSON)} 
            tagslist={TagsFilter(props.tagslist)} 
            seriesList={seriesQuery.data}
            initForm={characterInitState}
            larpRunTags={TagsFilterLARP(props.tagslist)}
            SubmitForm={(e, f) => SubmitForm(e, f)}
            GoBack={() => props.GoBack()}/>
        </>
    )}
    ItemCreate.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string,
    formJSON: PropTypes.object,
    tagslist: PropTypes.array
  }
