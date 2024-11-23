import { FormLabel, Input } from "@mui/material"
import { Form, FormGroup } from 'reactstrap'
import { useForm } from "react-hook-form"
import PropTypes from 'prop-types'

export default function TagEditForm(props) {

        // handles dropdown focus
        const focused = (e, length) => {
          if (length+1 > 6) {
            e.target.size = 6;
          }
          else {
            e.target.size = length+1;
          }
        }
        const blurred = (e) => {
          e.target.size = 1;
          e.target.blur();
        }

    
    const { register, handleSubmit, setValue } = useForm({
        reValidateMode: 'onChange'
      })

      const updateValue = (e) => {
        setValue(e.target.name, e.target.value)
      }

      const handleFormSubmit = async (data) => {
        props.SubmitForm(data)
      }

  return (
      <div className="entryForm">
        <Form>
    <FormGroup>
    <div className="input-pair">
            <FormLabel htmlFor="pronouns">TagType:</FormLabel>
            <select 
              {...register('tagtypeguid')}
              defaultValue={props.data.tagtypeguid ?? ''}
              onChange={(e) => updateValue(e)}
              onFocus={(e) => focused(e, props.dropDownArray.length)}
              onBlur={(e) => blurred(e)}
              onKeyUp={(e) => e.code === "Escape" ? blurred(e) : null}>
              <option className="select-default" key='default' value='default'>select tag type</option>
              {props.dropDownArray.map((obj) => {
                return (
                  <>
                    { obj.guid !== null
                      ? <option className={'tagtype'} key={obj.guid} value={obj.guid}>
                        {obj.name}
                      </option>
                      : undefined
                    }
                  </>
                )
              })}
            </select>
          </div>

          <div className="input-pair">
    <FormLabel>Tag Name:</FormLabel>
       <Input 
         type="text" 
         name="name" 
         {...register('name')}
        defaultValue={props.data.name} 
        onChange={(e) => updateValue(e)} />
        </div>
    <div className="input-pair">
            <FormLabel htmlFor="pronouns">Locked to LARP:</FormLabel>
            <select 
              {...register('larptagGuid')}
              defaultValue={props.data.larpGuid ?? ''}
              onChange={(e) => updateValue(e)}
              onFocus={(e) => focused(e, props.larpList.length)}
              onBlur={(e) => blurred(e)}
              onKeyUp={(e) => e.code === "Escape" ? blurred(e) : null}>
              {props.larpList.map((obj) => {
                return (
                  <>
                    { obj.guid !== null
                      ? <option className={'tagtype'} key={obj.guid} value={obj.guid}>
                        {obj.name}
                      </option>
                      : undefined
                    }
                  </>
                )
              })}
            </select>
          </div>
          <div className="input-pair"></div>
          </FormGroup>
        </Form>
        <div className="edit-bottom">
          <button className="button-cancel" onClick={() => props.GoBack(false)}>Cancel</button>
          <button className="button-save" onClick={() => handleSubmit(handleFormSubmit)}>Submit Changes</button>
        </div>
      </div>
    )
    }

    TagEditForm.propTypes = {
      GoBack: PropTypes.func,
      SubmitForm: PropTypes.func,
      data:  PropTypes.object,
      larpList:  PropTypes.array,
      dropDownArray: PropTypes.array
    }
