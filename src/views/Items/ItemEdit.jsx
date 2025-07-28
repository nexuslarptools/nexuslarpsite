import PropTypes from 'prop-types'
import Loading from '../../components/loading/loading'
import useGetData from '../../utils/getdata';
import { useQueryClient } from '@tanstack/react-query';
import usePutData from '../../utils/putdata';
import uploadToS3 from '../../utils/s3';
import ItemEditFormWrapper from '../../components/forms/itemeditfromwrapper';
import { useState } from 'react';
import PostData from "../../utils/postdata"


export default function ItemEdit(props) {
  const queryClient = useQueryClient();
  const [isMutating, setIsMutating] = useState(false);

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
          Values: sectionData,
          IsdoubleSide: formJSON[key].IsdoubleSide
        }
        formData.push(section);
      }
      return formData;
    }

    const SubmitForm = async (data, imagelocation, newimage1) => {
        let bodyData = data
        const larpguid = []
        larpguid.push(data.larptagGuid)
        if (data.larptagGuid !== undefined && data.larptagGuid !== null && data.larptagGuid !== '') {
        bodyData.larptagGuid=larpguid
        }
        bodyData.Img1 = bodyData.guid + '.jpg'

        if (newimage1) {
          await uploadToS3('images/Items/' + bodyData.Img1, imagelocation)
        }

        await currItemMutation.mutate(bodyData)
        await setIsMutating(true);
      }

      const Approve = async () => {
        await newApprovalMutation.mutate()
        queryClient.invalidateQueries(props.guid, 'listApprovedItems', 'listUnapprovedItems')
        props.GoBack(true)
      }

      const AddReview = async (e) => {
        let newmessage = {
          message: e,
          acks: [],
          sheetId: itemQuery.data.id
        }
        await newMesageMutation.mutate(newmessage)
        queryClient.invalidateQueries(['messages_' + props.guid, 'issubbed_' + props.guid] )
      }

    const currItemMutation = usePutData('/api/v1/ItemSheets/' + props.guid, ['editItem', props.guid])
    const newMesageMutation = PostData('/api/v1/ReviewMessages/Item', ['messages_' + props.guid])
    const newApprovalMutation = usePutData('/api/v1/ItemSheets/' + props.guid + '/Approve', [props.guid, 'listApprovedItems', 'listUnapprovedItems']);
    const itemQuery = useGetData(props.guid + "_editfetch", '/api/v1/' + props.path + '/' + props.guid)  
    const tagsQuery = useGetData('listTags', '/api/v1/Tags/groupbytyperead') 
    const seriesQuery = useGetData('listSeriesShort', '/api/v1/Series/ShortList') 
    const messagesQuery = useGetData('messages_' + props.guid , '/api/v1/ReviewMessages/Item/' + props.guid) 
    const subscriptionQuery = useGetData('issubbed_' + props.guid , '/api/v1/ReviewSub/Item/IsSubbbed/' + props.guid) 
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

      if (isMutating && currItemMutation.isSuccess) {
        props.OpenSnack("Update Successful");
        setIsMutating(false);
      }
      if (isMutating && currItemMutation.isError) {
        props.OpenSnack("Update Failed!");
        setIsMutating(false);
      }

    if (tagsQuery.isLoading || seriesQuery.isLoading || itemQuery.isLoading || userGuidQuery.isLoading || messagesQuery.isLoading 
      || subscriptionQuery.isLoading
    ) 
    return (<div>
      <Loading />
      </div>)
    if (tagsQuery.isError || seriesQuery.isError || itemQuery.isError || userGuidQuery.isError || messagesQuery.isError 
      || subscriptionQuery.isError
    ) 
    return (<div>
              Error!
              </div>)


    return (
        <>
        <ItemEditFormWrapper 
        path={props.path}
        formJSON={initForm(props.formJSON)} 
        messagesList = {messagesQuery.data}
        isSubbed={subscriptionQuery.data}
        AddReview={(e) => AddReview(e)}
            tagslist={TagsFilter(props.tagslist)} 
            seriesList={seriesQuery.data}
            initForm={{
                showResult: true,
                apiMessage: itemQuery.data
              }}
            larpRunTags={TagsFilterLARP(props.tagslist)}
            SubmitForm={(e, f, g) => SubmitForm(e, f, g)}
            GoBack={() => props.GoBack()}
            Approve={() => Approve()}
            currenUserGuid={userGuidQuery.data}/>
        </>
    )}
    ItemEdit.propTypes = {
    GoBack: PropTypes.func,
    OpenSnack: PropTypes.func,
    tagInfo: PropTypes.object,
    guid: PropTypes.string,
    dropDownArray: PropTypes.array,
    selectedLARPOption: PropTypes.string,
    formJSON: PropTypes.object,
    tagslist: PropTypes.array,
    path: PropTypes.string
  }
