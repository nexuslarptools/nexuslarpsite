import { FormLabel, Input } from "@mui/material"
import { Form, FormGroup } from 'reactstrap'
import { useForm } from "react-hook-form"
import PropTypes from 'prop-types'
import React from "react";

export default function LarpEditForm(props) {

  const formRef = React.useRef();
    const { register, handleSubmit, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
      })

      const updateValue = (e) => {
        setValue(e.target.name, e.target.value)
      }

      const handleFormSubmit = async (data) => {
        props.SubmitForm(data)
      }

      return (
        <>
          <header className="header">{props.title}</header>
          <div className="entryForm">
            <Form ref={formRef}>
              <FormGroup>
                <div className="input-pair">
                  <FormLabel htmlFor="name" required>LARP Name:</FormLabel>
                  <Input required
                    type="text"
                    name="name"
                    {...register('name')}
                    defaultValue={props.data.name}
                    onChange={(e) => updateValue(e)}
                  />
                </div>
                <div className="input-pair">
                  <FormLabel htmlFor="shortname">LARP Short Name:</FormLabel>
                  <Input
                    type="text"
                    name="shortname"
                    {...register('shortname')}
                    defaultValue={props.data.shortname}
                    onChange={(e) => updateValue(e)}
                  />
                </div>
                <div className="input-pair">
                  <FormLabel htmlFor="location" required>LARP Location:</FormLabel>
                  <Input required
                    type="text"
                    name="location"
                    {...register('location')}
                    defaultValue={props.data.location}
                    onChange={(e) => updateValue(e)}
                  />
                </div>
              </FormGroup>
              <div className="input-pair">
                  <FormLabel>LARP Information Meanings:</FormLabel>
                  <div className="info-list">
                    <ul>
                      <li><b>Name</b>: The official name of the LARP.</li>
                      <li><b>Shorthand Name</b>: If there is one, the shorter way most people actually refer to the LARP.</li>
                      <li><b>Location</b>: The physical address that the LARP takes place at - usually inside of a convention center. If this is an online-only LARP, just list the location as &apos;online&apos;.</li>
                    </ul>
                  </div>
                </div>
            </Form>
          </div>
          <div className="edit-bottom">
            <button className="button-cancel" onClick={() => props.GoBack()}>Cancel</button>
            <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Submit Changes</button>
          </div>
        </>
      )
    }

    LarpEditForm.propTypes = {
      GoBack: PropTypes.func,
      SubmitForm: PropTypes.func,
      data:  PropTypes.object,
      larpList:  PropTypes.array,
      dropDownArray: PropTypes.array,
      title: PropTypes.string
    }
