import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import usePresignedImgQuery from '../../hooks/usePresignedImgQuery';
import CharacterNo from './characterno';

const CharacterWrapperNo = props => {

    const imgUrl = usePresignedImgQuery('images/Characters/' + props.guid +'.jpg', (props.path === 'UnApproved' || props.path === 'CharacterSheets'
        || props.character === undefined || props.character === null || props.character.img1 ===undefined
        ? null : props.character.img1 ));
    const imgUrl2 = usePresignedImgQuery('images/Characters/'+ props.guid +'_2.jpg', 
        (props.path === 'UnApproved' || props.path === 'CharacterSheets'
        || props.character === undefined || props.character === null || props.character.img2 ===undefined
        ? null : props.character.img2 ));

    if (imgUrl.isLoading || imgUrl2.isLoading) return (
        <div>
        <Loading />
        </div>)
    if (imgUrl.error !== null && imgUrl2.error !== null ) return (
          <div>
          Error!
          </div>)

    return (
        <>
          <CharacterNo
          extraGmSpaceOn={props.extraGmSpaceOn} 
          specialSkillSpace={props.specialSkillSpace} 
          fontSize={props.fontSize} fontType={props.fontType} formJSON={props.formJSON} character={props.character} img={imgUrl.url} img2={imgUrl2.url}/> 
        </>
    )
}

export default CharacterWrapperNo;

CharacterWrapperNo.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  guid: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string,
  character: PropTypes.object,
  formJSON: PropTypes.object,
  extraGmSpaceOn: PropTypes.object, 
  specialSkillSpace: PropTypes.object, 
  fontSize: PropTypes.object,  
  fontType: PropTypes.object 
}