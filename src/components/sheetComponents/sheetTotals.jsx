import PropTypes from 'prop-types';
import './_sheetStatsTable.scss';



const SheetTotals = props => {
    return (
      <>
          <div className='sheet-totals'>
            <div className='integrity-total'>
              Integrity: 
                 <div className='symbols-row'>
                    { Array.apply(null, { length: props.data.INTEGRITY }).map((e, i) => (
                      <span className="integrity" key={i} alt="integrity"></span>
                    ))}
                  </div>
            </div>
            <div className='energy-total'>
              Energy:
                  <div className='symbols-row'>
                    { Array.apply(null, { length: props.data.Energy }).map((e, i) => (
                      <span className="energy" key={i} alt="energy"></span>
                    ))}
                  </div>
          
            </div>
          </div>

      </>
    )
}

export default SheetTotals;

SheetTotals.propTypes = {
    data: PropTypes.object
}