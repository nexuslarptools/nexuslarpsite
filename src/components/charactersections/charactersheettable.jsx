import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/loading/loading';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Paper from '@mui/material/Paper';

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
        <TableContainer className={props.tableClasses} component={Paper}>
          <Table size="small">
            <TableBody>
              {JSONData.formData.map((item) => (
                <TableRow key={item.Name}>
                  {
                    item.Name === 'over:' || item.Name === 'vehicle:'
                      ? <>
                          <TableCell className='sheet-table-attribute type' align="left">{item.Name} {item.Value}</TableCell>
                        </>
                      : <>
                          <TableCell className='sheet-table-attribute' align="left">{item.Name}</TableCell>
                          <TableCell className='sheet-table-number' align="left">{item.Value}</TableCell>
                        </>
                  }
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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