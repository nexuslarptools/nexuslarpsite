import PropTypes from "prop-types";
import usePresignedImgQuery from "../../hooks/usePresignedImgQuery";
import Loading from "../loading/loading";
import CharacterEditForm from "./charactereditform";
import  PostData from "../../utils/postdata";
import usePutData from "../../utils/putdata";
import { useQueryClient } from "@tanstack/react-query";

const CharacterEditFormWrapper = (props) => {
  const queryClient = useQueryClient();

  const Subscribe = async () => {
     let body = {
       sheetGuid: props.initForm.apiMessage.guid
      }
      await subscribeMutation.mutate(body)
      queryClient.invalidateQueries('issubbed_' + props.initForm.apiMessage.guid)
  }

  const Unsubscribe = async () => {
      await unsubscribeMutation.mutate()
      queryClient.invalidateQueries('issubbed_' + props.initForm.apiMessage.guid)
  }

  const subscribeMutation = PostData('/api/v1/ReviewSub/Item')
  const unsubscribeMutation = usePutData('/api/v1/ReviewSub/StopItemSub/' + props.isSubbed.id)


const imgUrl = usePresignedImgQuery('images/Characters/' + props.initForm.apiMessage.guid +'.jpg', (props.path === 'UnApproved' || props.path === 'CharacterSheets'
    || props.initForm.apiMessage === undefined || props.initForm.apiMessage === null || props.initForm.apiMessage.img1 ===undefined
      ? null : props.initForm.apiMessage.img1 ));
    const imgUrl2 = usePresignedImgQuery('images/Characters/'+ props.initForm.apiMessage.guid +'_2.jpg', 
      (props.path === 'UnApproved' || props.path === 'CharacterSheets'
      || props.initForm.apiMessage === undefined || props.initForm.apiMessage === null || props.initForm.apiMessage.img2 ===undefined
      ? null : props.initForm.apiMessage.img2 ));

      
    if ( imgUrl.isLoading || imgUrl2.isLoading) return (<div>
        <Loading />
        </div>)
      if ( imgUrl.error !== null || imgUrl2.error !== null) return (<div>
                Error!
                </div>)
  

  return (
    <>
    <CharacterEditForm 
    img={imgUrl.url}
    img2={imgUrl2.url}
    authLevel={props.authLevel}
    currenUserGuid={props.currenUserGuid}
    formJSON={props.formJSON} 
    messagesList = {props.messagesList}
        tagslist={props.tagslist} 
        seriesList={props.seriesList}
        initForm={props.initForm}
        userGuid={props.userGuid}
        itemTags={props.itemTags}
        appdata={props.appdata} 
        undata={props.undata} 
        larpRunTags={props.larpRunTags}
        Subscribe={() => Subscribe()}
        Unsubscribe={() => Unsubscribe()}
        AddReview={(e) => props.AddReview(e)}
        Submit={(e, f, g, h, i) => props.Submit(e, f, g, h ,i)}
        GoBack={() => props.GoBack()}
        Approve={() => props.Approve()}
        /> 
    </>
)
}
export default CharacterEditFormWrapper;

CharacterEditFormWrapper.propTypes = {
    path: PropTypes.string,
    authLevel: PropTypes.number,
    isSubbed:PropTypes.object,
    currenUserGuid: PropTypes.string,
    messagesList: PropTypes.array,
    formJSON: PropTypes.array,
    tagslist: PropTypes.object,
    appdata: PropTypes.object,
    undata: PropTypes.object,
    itemTags: PropTypes.object,
    larpRunTags: PropTypes.array,
    Submit: PropTypes.func,
    AddReview: PropTypes.func,
    FetchPopoverItem: PropTypes.func,
    userGuid: PropTypes.string,
    showResult: PropTypes.bool,
    initForm: PropTypes.object,
    apiMessage: PropTypes.object,
    ReturnItem: PropTypes.func,
    GoBack: PropTypes.func,
    Approve: PropTypes.func,
    seriesList: PropTypes.array,
    img: PropTypes.string,
    img2: PropTypes.string
}