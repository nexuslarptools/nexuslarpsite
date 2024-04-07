import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import CharacterSheetTable from './charactersheettable';

const CharacterSheetHeading = props => {
  if (!props) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
      <>
        <div className='basic-info'>
          <div className='table-statistics'>
            <CharacterSheetTable list={props.attributes} tableClasses={'statistics sheet-table'} tableName={'Statistics'} />
          </div>
          <div className="bio">{props.other.Values.Bio.Value}</div>
          <div className='imgContainer'>
            <img src={props.img} className='charImg' alt="character headshot"></img>
          </div>
        </div>
      </>
    )
  }
}

export default CharacterSheetHeading;

CharacterSheetHeading.propTypes = {
  props: PropTypes.object,
  name: PropTypes.string,
  series: PropTypes.string,
  img: PropTypes.string,
  other: PropTypes.object,
  attributes: PropTypes.object
}