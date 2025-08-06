import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';
import './_sheetStatsTable.scss';
import { capitalizeFirstLetter } from '../../utils/stringProcess';

const moveValues = ["Move", "Run", "Sail", "Fly"]

const SheetsStatsTable = (props) => {
  const [values, setValues] = useState([]);
  const [JSONData, setJSONData] = useState({
    formData: [],
    show: false
  })

  useEffect(() => {
    initData(props.list)
  }, [])

  const initData = async (formJSON) => {
    let valueList = ["Grade",
    "Power","Response","RESILIENCE"]

    const formData = []
    let moveindex = 0;

    for (const key of Object.keys(formJSON)) {
      const jsonItem = {
        Name: key,
        Value: formJSON[key]
      }
      formData.push(jsonItem);
      if (moveValues.indexOf(key) !== -1 && formJSON[key] !== null 
      && formJSON[key] !== '' && moveValues.indexOf(key) > moveindex) {
        moveindex = moveValues.indexOf(key);
      }
    }

    valueList.splice(2, 0, moveValues[moveindex]);

    setValues(valueList);

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
        <TableContainer className={props.tableClasses} component={Paper}>
          <Table size="small">
            <TableBody>
              {values.map((item) => (
                JSONData.formData.findIndex((dat) => dat.Name === item) !== -1 ?
                <TableRow key={item}>
                  {
                    item === 'over:' || item === 'vehicle:'
                      ? <>
                         {
                         (JSONData.formData.findIndex((entry) => entry.Name === 'Pilot Vehicle' && entry.Value !== '0' && entry.Value !== null && entry.Value !== undefined) !== -1 
                         && item.Name === 'vehicle:') ||
                         (JSONData.formData.findIndex((entry) => entry.Name === 'Authority' && entry.Value !== '0' && entry.Value !== null && entry.Value !== undefined) !== -1 
                         && item.Name === 'over:')
                          ?
                          (item.Name === 'over:' && item.Value !== undefined && item.Value.length < 14) ||
                          (item.Name === 'vehicle:' && item.Value !== undefined && item.Value.length < 11) ?
                          <TableCell className='sheet-table-attribute type' align="left">{capitalizeFirstLetter(item.Name.toLowerCase())} {item.Value}</TableCell> 
                          : <TableCell className='sheet-table-attribute typeSM' align="left">{capitalizeFirstLetter(item.Name.toLowerCase())} {item.Value}</TableCell> 
                          :
                          <></>
                         }
                        </>
                      : <>
                          <TableCell className='sheet-table-attribute' align="left">{capitalizeFirstLetter(item.toLowerCase())}</TableCell>
                          <TableCell className='sheet-table-number' align="left">{JSONData.formData[JSONData.formData.findIndex((dat) => dat.Name === item)].Value}</TableCell>
                        </>
                  }
                </TableRow> :
                <></>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    )
  }
}

export default SheetsStatsTable;

SheetsStatsTable.propTypes = {
  props: PropTypes.object,
  list: PropTypes.object,
  tableName: PropTypes.string,
  tableClasses: PropTypes.string
}