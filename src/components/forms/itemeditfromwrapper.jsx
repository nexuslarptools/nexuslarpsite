import PropTypes from "prop-types";
import usePresignedImgQuery from "../../hooks/usePresignedImgQuery";
import Loading from "../loading/loading";
import ItemEditForm from "./itemeditform";
import usePutData from "../../utils/putdata";
import { useQueryClient } from "@tanstack/react-query";
import  PostData from "../../utils/postdata";

const ItemEditFormWrapper = (props) => {

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

    const imgUrl = usePresignedImgQuery('images/Items/' + props.initForm.apiMessage.guid +'.jpg', (props.path === 'UnApproved' || props.path === 'ItemSheets'
        || props.path === undefined || props.path === null
        || props.initForm.apiMessage === undefined || props.initForm.apiMessage === null || props.initForm.apiMessage.img1 ===undefined
          ? null : props.initForm.apiMessage.img1 ));
    
        if ( imgUrl.isLoading ) return (<div>
            <Loading />
            </div>)
          if ( imgUrl.error !== null) return (<div>
                    Error!
                    </div>)
      
    
    
    return (
        <>
        <ItemEditForm formJSON={props.formJSON} 
            messagesList = {props.messagesList}
            isSubbed={props.isSubbed}
            AddReview={(e) => props.AddReview(e)}
            tagslist={props.tagslist} 
            seriesList={props.seriesList}
            initForm={props.initForm}
            larpRunTags={props.larpRunTags}
            Subscribe={() => Subscribe()}
            Unsubscribe={() => Unsubscribe()}
            SubmitForm={(e, f, g) => props.SubmitForm(e, f, g)}
            GoBack={() => props.GoBack()}
            Approve={() => props.Approve()}
            currenUserGuid={props.currenUserGuid}
            img={imgUrl.url}/>
        </>
    )

}
export default ItemEditFormWrapper;

ItemEditFormWrapper.propTypes = {
    path: PropTypes.string,
    formJSON: PropTypes.array,
    messagesList: PropTypes.array,
    isSubbed:PropTypes.object,
    tagslist: PropTypes.object,
    itemList: PropTypes.object,
    itemTags: PropTypes.array,
    larpRunTags: PropTypes.array,
    AddReview:  PropTypes.func,
    Submit: PropTypes.func,
    FetchPopoverItem: PropTypes.func,
    showResult: PropTypes.bool,
    initForm: PropTypes.object,
    apiMessage: PropTypes.object,
    ReturnItem: PropTypes.func,
    GoBack: PropTypes.func,
    SubmitForm: PropTypes.func,
    Approve: PropTypes.func,
    seriesList: PropTypes.array,
    data: PropTypes.object,
    currenUserGuid: PropTypes.string,
    img: PropTypes.string
  }
  

