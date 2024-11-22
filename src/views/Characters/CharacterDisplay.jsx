import PropTypes from 'prop-types'
import useGetData from '../../utils/getdata';
import Loading from '../../components/loading/loading';
import formJSON from '../../jsonfiles/characterinput.json';
import CharacterWrapper from '../../components/character/characterwrapper';

const CharacterDisplayPage = props => {

    const characterQuery = useGetData(props.guid, '/api/v1/'+props.path+'/'+props.guid);  

    if (characterQuery.isLoading) 
    return (<div>
        <Loading />
    </div>)
    if (characterQuery.isError ) return (<div>
        Error!
        </div>)

  return (
    <>
      <CharacterWrapper id="character" formJSON={formJSON} character={characterQuery.data} path={props.path} guid={props.guid}/>
      <div className="edit-bottom">
            <button className="button-cancel" onClick={() => props.GoBackToList()}>Go Back!</button>
      </div>
    </>
  )
}

export default CharacterDisplayPage;

CharacterDisplayPage.propTypes = {
  GoBackToList: PropTypes.func,
  guid: PropTypes.string,
  path: PropTypes.string
}