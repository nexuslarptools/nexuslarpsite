import { Autocomplete,  FormLabel, Input, TextField } from "@mui/material"
import { Form, FormGroup } from 'reactstrap'
import { useForm } from "react-hook-form"
import PropTypes from 'prop-types'
import React, { useState } from "react"


export default function SeriesEditForm(props) {
  const formRef = React.useRef();
    const [tagState, setTagState] = useState({
        listTags: []
      })

    const { register, handleSubmit, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
      })

      const updateValue = (e) => {
        setValue(e.target.name, e.target.value)
      }

      const handleFormSubmit = async (data) => {
        data.Tags = tagState.listTags;
        props.SubmitForm(data);
      }

      const upDateTags = (e) => {
        const listguids = []
        e.forEach((element) => {
          listguids.push(element.guid)
        })
    
        setTagState({
          ...tagState,
          listTags: listguids
        })
      }

      return (
        <>
                <header className="header">{props.title}</header>
                <div className="edit-series">
                  <Form ref={formRef}>
                    <FormGroup>
                      <div className='input-pair'>
                        <FormLabel htmlFor="title" className="entryLabel" required>Series Title:</FormLabel>
                        <Input required
                          type="text"
                          id="title"
                          {...register('title', { required: true })}
                          onChange={(e) => updateValue(e)}
                          defaultValue={props.data !== null ? props.data.title : ''}
                        />
                      </div>
                      <div className='input-pair'>
                        <FormLabel htmlFor="titlejpn" className="entryLabel" required>Japanese Title:</FormLabel>
                        <Input required
                          type="text"
                          id="titlejpn"
                          {...register('titlejpn', { required: true })}
                          onChange={(e) => updateValue(e)}
                          defaultValue={props.data !== null ? props.data.titlejpn: ''}
                        />
                      </div>
                    </FormGroup>
                    <div className='input-pair'>
                      <FormLabel htmlFor="titlejpn" className="entryLabel" required>Series Description Tags:</FormLabel>
                      <Autocomplete
                        id="select-tags" 
                        multiple required
                        placeholder="select tags"
                        defaultValue={props.data !== null ? props.data.tags: null}
                        options={props.tagsList.tagsList}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, val) => upDateTags(val)}
                        renderInput={(params) => (
                          <TextField {...params} variant="filled" />
                        )}
                      />
                    </div>
                    <div className="input-pair">
                      <FormLabel>Notes:</FormLabel>
                      <div className="info-list">
                        <ul>
                          <li><b>Series Title</b>: The English series name.</li>
                          <li><b>Japanese Title</b>: The Japanese series name. Please keep it in Romanji since most of us can&apos;t read Moonspeak! :)</li>
                          <li><b>Tags</b>: What type of series is this? Quick-search tags that will allow someone to discover the series by categories. Multiple tags allowed, but also don&apos;t get silly with the number.</li>
                        </ul>
                      </div>
                    </div>
                  </Form>
                  <div className="edit-bottom">
                      <button className="button-cancel" onClick={() => props.GoBack(false)}>Cancel</button>
                      <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Submit Changes</button>
                    </div>
                </div>
              </>
        )
 }

 SeriesEditForm.propTypes = {
  title: PropTypes.string,
    GoBack: PropTypes.func,
    SubmitForm: PropTypes.func,
    data:  PropTypes.object,
    larpList:  PropTypes.object,
    dropDownArray: PropTypes.array,
    tagsList: PropTypes.object
  }