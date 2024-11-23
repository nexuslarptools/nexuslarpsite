import PropTypes from 'prop-types'
import PostData from "../../utils/postdata"
import { v4 } from 'uuid';
import Loading from '../../components/loading/loading'
import useGetData from '../../utils/getdata';
import CharacterEditForm from '../../components/forms/charactereditform';
import uploadToS3 from '../../utils/s3';


export default function CharacterCreate(props) {

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
          Values: sectionData
        }
        formData.push(section);
      }
      return formData;
    }

    const SubmitForm = async (data, image1, image2) => {
        let bodyData = data
        const larpguid = []
        larpguid.push(data.larptagGuid)
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
        bodyData.larptagGuid=larpguid
        }
        bodyData.guid = v4()
        bodyData.Img1 = bodyData.guid + '.jpg'
        bodyData.Img2 = bodyData.guid + '_2.jpg'

        uploadToS3('images/Characters/' + bodyData.Img1, image1);
        uploadToS3('images/Characters/' + bodyData.Img2, image2);

        await newCharacterMutation.mutate(bodyData)

        props.GoBack(true)
      }

    const newCharacterMutation = PostData('/api/v1/CharacterSheets', ['newCharacter', 'listUnapprovedCharacters']);
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead'); 
    const seriesQuery = useGetData('listSeriesShort', '/api/v1/Series/ShortList');
    const approvQuery = useGetData('listApprovedItems', '/api/v1/ItemSheetApproveds/FullListWithTagsNoImages');  
    const unapprovQuery = useGetData('listUnapprovedItems', '/api/v1/ItemSheets/FullListWithTagsNoImages'); 


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

    if (tagsQuery.isLoading || seriesQuery.isLoading || approvQuery.isLoading || unapprovQuery.isLoading) return (<div>
      <Loading />
      </div>)
    if (tagsQuery.isError || seriesQuery.isError || approvQuery.isError || unapprovQuery.isError) return (<div>
              Error!
              </div>)


    return (
        <>
        <CharacterEditForm formJSON={initForm(props.formJSON)} 
            tagslist={TagsFilter(props.tagslist)} 
            seriesList={seriesQuery.data}
            initForm={{
                showResult: null,
                apiMessage: null
              }}
            userGuid={props.userGuid}
            itemTags={TagsFilterItems(props.tagslist)}
            appdata={approvQuery.data} 
            undata={unapprovQuery.data} 
            larpRunTags={TagsFilterLARP(props.tagslist)}
            Submit={(e, f, g) => SubmitForm(e, f, g)}
            GoBack={() => props.GoBack()}/> 
        </>
    )}
    CharacterCreate.propTypes = {
    GoBack: PropTypes.func,
    tagInfo: PropTypes.object,
    data: PropTypes.object,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string,
    formJSON: PropTypes.object,
    tagslist: PropTypes.array,
    userGuid: PropTypes.string
  }
