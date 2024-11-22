import PropTypes from "prop-types";
import usePresignedImgQuery from "../../hooks/usePresignedImgQuery";
import Loading from "../loading/loading";
import CharacterEditForm from "./charactereditform";

const CharacterEditFormWrapper = (props) => {

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
        tagslist={props.tagslist} 
        seriesList={props.seriesList}
        initForm={props.initForm}
        userGuid={props.userGuid}
        itemTags={props.itemTags}
        appdata={props.appdata} 
        undata={props.undata} 
        larpRunTags={props.larpRunTags}
        Submit={(e, f, g) => props.Submit(e, f, g)}
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
    currenUserGuid: PropTypes.string,
    formJSON: PropTypes.array,
    tagslist: PropTypes.object,
    appdata: PropTypes.object,
    undata: PropTypes.object,
    itemTags: PropTypes.object,
    larpRunTags: PropTypes.array,
    Submit: PropTypes.func,
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