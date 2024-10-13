import { useEffect, useState, forwardRef } from 'react'
import PropTypes from 'prop-types';
import { FormGroup } from 'reactstrap';
import SingleTextField from './singletextfield';

const MultiTextField = forwardRef((props, ref) => {
  const [initState, setInitState] = useState(true);
  const [multiField, setMultiField] = useState({
    fieldname: '',
    fieldlabel: '',
    fieldValues: [],
    showValues: false
  });

  useEffect(() => {
    const controller = new AbortController();
    if (initState) {
      initMultiField(props);
      setInitState(false);
    }
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    }
  }, []);

  const initMultiField = (init) => {
    const valueslist=[]
    let newindex =0;

    if (init.defaultValue !== undefined && init.defaultValue !== null) {
    init.defaultValue.forEach(value => {
      const newValue = {
        index: newindex,
        fieldValue: value,
        visible: true
      };
      valueslist.push(newValue);
      newindex++;
      });
    }

    setMultiField({
      ...multiField,
      fieldname: init.fieldsState.fieldname,
      fieldlabel: init.fieldsState.fieldlabel,
      fieldValues: valueslist,
      showValues: true
    });

    props.updateMultiText({
      fieldname: init.fieldsState.fieldname,
      fieldlabel: init.fieldsState.fieldlabel,
      fieldValues: valueslist,
      showValues: true
    });
  }

  const updateMultField = (e) => {
    const valuesUpdate = [];
    multiField.fieldValues.forEach((value) => {
      if (value.index === e.index) {
        valuesUpdate.push(e);
      } else {
        valuesUpdate.push(value);
      }
    });

    let count = 0;
    valuesUpdate.forEach((value) => {
      value.index = count
      count = count + 1
    });

    const updatedField = multiField;
    updatedField.fieldValues = valuesUpdate;

    setMultiField({
      ...multiField,
      fieldValues: valuesUpdate
    });
    props.updateMultiText(updatedField);
  }

  const addMultiInputField = async (e) => {
    e.preventDefault();
    const newindex = multiField.fieldValues.length;
    const curFields = multiField.fieldValues;
    const newValue = {
      index: newindex,
      fieldValue: '',
      visible: true
    }
    curFields.push(newValue);
    await setMultiField({
      ...multiField,
      fieldValues: curFields
    });
    props.updateMultiText(multiField);
  }

  if (!multiField.showValues) {
    return ( <></> )
  } else {
    return (
      <>
        <FormGroup>
          <button className="button-basic" onClick={(e) => addMultiInputField(e)}>Add {multiField.fieldlabel}</button>
          {multiField.fieldValues.map((item) => (
            <SingleTextField key={item.index} label={multiField.fieldlabel + ' ' + (item.index + 1).toString()}
              index={item.index} fieldValue={ item.fieldValue } visible={ item.visible }
              updateMultiForm={ (e) => updateMultField(e)} />
          ))}
        </FormGroup>
      </>
    )
  }
})

MultiTextField.displayName = 'MultiTextField';

export default MultiTextField;

MultiTextField.propTypes = {
  fieldsState: PropTypes.object,
  onFillIn: PropTypes.func,
  addTextField: PropTypes.func,
  updateMultiText: PropTypes.func,
  defaultValue: PropTypes.array
}