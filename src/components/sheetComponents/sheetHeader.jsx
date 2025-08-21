import PropTypes from 'prop-types';
import './_sheetStatsTable.scss';

const SheetHeader = props => {
    return (
      <>
          <div className='ship-name-series'>
            <div className='shipName'>
              {props.data.name ? props.data.name : "." }
            </div>
            <div className='seriesName'>
                {props.data.series ? props.data.series : "" }
            </div>
          </div>

      </>
    )
}

export default SheetHeader;

SheetHeader.propTypes = {
    data: PropTypes.object
}