import PropTypes from "prop-types";
import usePresignedImgQuery from "../../hooks/usePresignedImgQuery";
import Loading from "../loading/loading";
import ItemEditForm from "./itemeditform";

const ItemEditFormWrapper = (props) => {

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
            tagslist={props.tagslist} 
            seriesList={props.seriesList}
            initForm={props.initForm}
            larpRunTags={props.larpRunTags}
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
    tagslist: PropTypes.object,
    itemList: PropTypes.object,
    itemTags: PropTypes.array,
    larpRunTags: PropTypes.array,
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
  

