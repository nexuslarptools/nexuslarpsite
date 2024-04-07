import PropTypes from 'prop-types'
import Loading from '../../components/loading/loading'
import useGetData from '../../utils/getdata';
import ItemEditForm from '../../components/forms/itemeditform';
import { useQueryClient } from '@tanstack/react-query';
import usePutData from '../../utils/putdata';


export default function ItemEdit(props) {
  const queryClient = useQueryClient();
    const initForm = (formJSON) => {
      const formData = [];
  
      for (const key of Object.keys(formJSON)) {
        const sectionData = [];
        for (const subkey of Object.keys(formJSON[key].Values)) {
          const jsonItem = {
            Label: formJSON[key].Values[subkey].Label,
            Type: formJSON[key].Values[subkey].Type,
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
          Values: sectionData
        }
        formData.push(section);
      }
      return formData;
    }

    const SubmitForm = async (data) => {
        let bodyData = data
        const larpguid = []
        larpguid.push(data.larptagGuid)
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
        bodyData.larptagGuid=larpguid
        }
        bodyData.Img1 = bodyData.guid + '.jpg'

        await currItemMutation.mutate(bodyData)

        props.GoBack(true)
      }

      const Approve = async () => {
        await newApprovalMutation.mutate()
        queryClient.invalidateQueries(props.guid, 'listApprovedItems', 'listUnapprovedItems')
        props.GoBack(true)
      }

    const currItemMutation = usePutData('/api/v1/ItemSheets/' + props.guid, ['editItem', props.guid])
    const newApprovalMutation = usePutData('/api/v1/ItemSheets/' + props.guid + '/Approve', [props.guid, 'listApprovedItems', 'listUnapprovedItems']);
    const itemQuery = useGetData(props.guid + "_editfetch", '/api/v1/' + props.path + '/' + props.guid)  
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead') 
    const seriesQuery = useGetData('listSeriesShort', '/api/v1/Series/ShortList') 
    const userGuidQuery = useGetData('userguid', '/api/v1/Users/CurrentGuid');

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

    if (tagsQuery.isLoading || seriesQuery.isLoading || itemQuery.isLoading || userGuidQuery.isLoading ) return (<div>
      <Loading />
      </div>)
    if (tagsQuery.isError || seriesQuery.isError || itemQuery.isError || userGuidQuery.isError ) return (<div>
              Error!
              </div>)


    return (
        <>
        <ItemEditForm formJSON={initForm(props.formJSON)} 
            tagslist={TagsFilter(props.tagslist)} 
            seriesList={seriesQuery.data}
            initForm={{
                showResult: true,
                apiMessage: itemQuery.data
              }}
            larpRunTags={TagsFilterLARP(props.tagslist)}
            SubmitForm={(e) => SubmitForm(e)}
            GoBack={() => props.GoBack()}
            Approve={() => Approve()}
            currenUserGuid={userGuidQuery.data}/>
        </>
    )}
    ItemEdit.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    guid: PropTypes.string,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string,
    formJSON: PropTypes.object,
    tagslist: PropTypes.array,
    path: PropTypes.string
  }
