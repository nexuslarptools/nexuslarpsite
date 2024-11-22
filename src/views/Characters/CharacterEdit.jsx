import PropTypes from 'prop-types'
import Loading from '../../components/loading/loading'
import useGetData from '../../utils/getdata';
import usePutData from '../../utils/putdata';
import { useQueryClient } from '@tanstack/react-query';
import uploadToS3 from '../../utils/s3';
import CharacterEditFormWrapper from '../../components/forms/charactereditformWrapper';

export default function CharacterEdit(props) {
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

    const SubmitForm = async (data, image1, image2) => {
        let bodyData = data
/*         const larpguid = []
        larpguid.push(data.larptagGuid)
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
        bodyData.larptagGuid=larpguid
        } */

        uploadToS3('images/Characters/' + props.guid  + '.jpg', image1);
        uploadToS3('images/Characters/' + props.guid + '_2.jpg', image2);
        await newCharacterMutation.mutate(bodyData)
        queryClient.invalidateQueries(props.guid)
        props.GoBack(true)
      }

    const Approve = async () => {
        await newApprovalMutation.mutate();
        queryClient.invalidateQueries(props.guid, 'listUnapprovedCharacters', 'listApprovedCharacters');
        props.GoBack(true);
      }

    const newCharacterMutation = usePutData('/api/v1/CharacterSheets/' + props.guid, [props.guid, 'listUnapprovedCharacters']);
    const newApprovalMutation = usePutData('/api/v1/CharacterSheets/' + props.guid + '/Approve', [props.guid, 'listUnapprovedCharacters']);
    const characterQuery = useGetData(props.guid, '/api/v1/' + props.path + '/' + props.guid)  
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead'); 
    const seriesQuery = useGetData('listSeriesShort', '/api/v1/Series/ShortList');
    const approvQuery = useGetData('listApprovedItems', '/api/v1/ItemSheetApproveds/FullListWithTagsNoImages');  
    const unapprovQuery = useGetData('listUnapprovedItems', '/api/v1/ItemSheets/FullListWithTagsNoImages'); 
    const userGuidQuery = useGetData('userguid', '/api/v1/Users/CurrentGuid');


    const TagsFilter = (response)  => {

        const chartagsResult = [];
        const itemtagsResult =[];
        const abilitytagsResult = [];
        const larpRuntagsResult = [];
        response.forEach(element => {
          if (element.tagType === 'Character') {
            element.tagsList.forEach(tag => {
              itemtagsResult.push(tag)
            });
          }
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
              itemtagsResult.push(tag)
            });
          }
        })

        return {     
          characterTags: chartagsResult,
          abilityTags: abilitytagsResult,
          itemTags: itemtagsResult,
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

      const TagsFilterItems = (response)  => {

        const larpRuntagsResult = [];
        response.forEach(element => {
          if (element.tagType === 'Items') {
            element.tagsList.forEach(tag => {
              larpRuntagsResult.push(tag)
            });
          }
        })

        return {larpRuntagsResult}
      }

    if (tagsQuery.isLoading || seriesQuery.isLoading || approvQuery.isLoading 
    || unapprovQuery.isLoading || characterQuery.isLoading || userGuidQuery.isLoading) return (<div>
      <Loading />
      </div>)
    if (tagsQuery.isError || seriesQuery.isError || approvQuery.isError 
    || unapprovQuery.isError || characterQuery.isError || userGuidQuery.isError) return (<div>
              Error!
              </div>)

    return (
        <>
        <CharacterEditFormWrapper
        path={props.path} 
        authLevel={props.authLevel}
        currenUserGuid={userGuidQuery.data}
        formJSON={initForm(props.formJSON)} 
            tagslist={TagsFilter(props.tagslist)} 
            seriesList={seriesQuery.data}
            initForm={{
                showResult: true,
                apiMessage: characterQuery.data}}
            userGuid={props.userGuid}
            itemTags={TagsFilterItems(props.tagslist)}
            appdata={approvQuery.data} 
            undata={unapprovQuery.data} 
            larpRunTags={TagsFilterLARP(props.tagslist)}
            Submit={(e, f, g) => SubmitForm(e, f, g)}
            GoBack={() => props.GoBack()}
            Approve={() => Approve()}
            /> 
        </>
    )}
    CharacterEdit.propTypes = {
    authLevel: PropTypes.number,
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string,
    formJSON: PropTypes.object,
    tagslist: PropTypes.array,
    userGuid: PropTypes.string,
    guid: PropTypes.string,
    path: PropTypes.string
  }
