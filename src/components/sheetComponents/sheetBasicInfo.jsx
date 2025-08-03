import PropTypes from 'prop-types';
import './_sheetBasicInfo.scss';
import SheetsStatsTable from './sheetStatsTable';


const SheetBasicInfo = props => {

    return (
      <>
        <div className='basic-info'>
          <div className='table-statistics'>
            <SheetsStatsTable list={props.data.fields} 
             tableClasses={'statistics sheet-table'} tableName={'Statistics'} />
          </div>
          <div className="bio">{props.data.fields.Description  ?  props.data.fields.Description : ""}</div>
          <div className='shipImgContainer'>
            <img src={props.img} className='shipImg' alt="character headshot"></img>
          </div>
        </div>
      </>
    )
  }

export default SheetBasicInfo;

SheetBasicInfo.propTypes = {
  data: PropTypes.object,
  img: PropTypes.string
}