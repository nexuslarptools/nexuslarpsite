import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Button } from 'reactstrap';

const SingleTextField = props => {
  const [initState, setInitState] = useState(true);
  const [updateState, setUpdateState] = useState(false);

  const [textField, setTextField] = useState({
    index: 0,
    fieldValue: '',
    visible: false
  });

  useEffect(() => {
    const controller = new AbortController()
    if (initState) {
      initField(props);
      setInitState(false);
    }
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    }
  }, []);

  const initField = (init) => {
    setTextField({
      ...textField,
      index: init.index,
      fieldValue: init.fieldValue,
      visible: init.visible
    });
  }

  const updateField = (e) => {
    setTextField({
      ...textField,
      fieldValue: e
    });
    setUpdateState(true);
  }

  const hideField = () => {
    setTextField({
      ...textField,
      visible: false
    });
    setUpdateState(true);
  }

  useEffect(() => {
    const controller = new AbortController();
    if (!initState && updateState) {
      props.updateMultiForm(textField);
      setUpdateState(false);
    }
    return () => {
      // cancel the request before component unmounts
      controller.abort();
    }
  }, [updateState]);

  const ref = useRef();

  if (!textField.visible) {
    return ( <></> )
  } else {
    return (
      <>
        <span ref={ref}>
          <Button onClick={() => hideField()}>X</Button>
          <TextField variant="standard" type="input" className="form-control" id={props.index.toString()}
          defaultValue={props.fieldValue}
            onChange={(e) => updateField(e.target.value)}/>
        </span>
      </>
    )
  }
}

export default SingleTextField;

SingleTextField.propTypes = {
  fieldsState: PropTypes.object,
  index: PropTypes.number,
  updateMultiForm: PropTypes.func,
  label: PropTypes.string,
  fieldValue: PropTypes.string
}