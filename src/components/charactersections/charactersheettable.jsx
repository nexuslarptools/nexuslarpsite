import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import './_CharacterSheetTable.css';

const CharacterSheetTable = (props) => {
  const [JSONData, setJSONData] = useState({
    formData: [],
    show: false
  })

  useEffect(() => {
    initData(props.list)
  }, [])

  const initData = async (formJSON) => {
    const formData = []

    for (const key of Object.keys(formJSON.Values)) {
      const jsonItem = {
        Name: formJSON.Values[key].Name,
        Value: formJSON.Values[key].Value
      }
      formData.push(jsonItem);
    }

    await setJSONData({
      ...JSONData,
      formData,
      show: true
    });
  }

  if (!props || !JSONData.show) {
    return (<div className='loading-container'><Loading /></div>)
  } else {
    return (
      <>
        {props.tableName !== undefined
          ? <div className='sheet-table-heading'><span>{props.tableName}</span></div>
          : <div className='sheet-table-heading blank'></div>
        }
          <table size="small">
              {JSONData.formData.map((item) => (
               item.Name === 'over:' || item.Name === 'vehicle:'
                 ? 
<>
                  {    
                         (JSONData.formData.findIndex((entry) => entry.Name === 'Pilot Vehicle' && entry.Value !== '0' && entry.Value !== null && entry.Value !== undefined) !== -1 
                         && item.Name === 'vehicle:') ||
                         (JSONData.formData.findIndex((entry) => entry.Name === 'Authority' && entry.Value !== '0' && entry.Value !== null && entry.Value !== undefined) !== -1 
                         && item.Name === 'over:')
                          ?
                          <tr className='tableRow' key={item.Name}>
                          <th className='sheet-table-attribute type' align="left">{item.Name} {item.Value}</th>
                          </tr>
                          :
                          <></>
                    
                  }
                </> : 
                <tr className='tableRow' key={item.Name}>
                <th className='sheet-table-attribute' align="left">{item.Name}</th>
                <th className='sheet-table-number' align="left">{item.Value}</th>
                </tr>
              ))}
          </table>
      </>
    )
  }
}

export default CharacterSheetTable;

CharacterSheetTable.propTypes = {
  props: PropTypes.object,
  list: PropTypes.object,
  tableName: PropTypes.string,
  tableClasses: PropTypes.string
}