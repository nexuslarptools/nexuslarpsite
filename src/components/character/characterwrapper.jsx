import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import usePresignedImgQuery from '../../hooks/usePresignedImgQuery';
import Character from './character';


const CharacterWrapper = props => {

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
          <Character formJSON={props.formJSON} character={props.character} img={imgUrl.url} img2={imgUrl2.url}/> 
        </>
    )
}

export default CharacterWrapper;

CharacterWrapper.propTypes = {
  props: PropTypes.object,
  item: PropTypes.object,
  guid: PropTypes.string,
  path: PropTypes.string,
  type: PropTypes.string,
  character: PropTypes.object,
  formJSON: PropTypes.object
}