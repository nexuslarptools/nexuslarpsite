
import { useState } from "react"
import { Button, FormLabel, Input, MenuItem, Select } from "@mui/material"
import { Form, FormGroup } from 'reactstrap'
import { useForm } from "react-hook-form"
import usePutData from "../../utils/putdata"
import PropTypes from 'prop-types'

export default function UserSelfEditForm(props) {

    const [pronounsguid, setPronounsguid] = useState(props.data.pronounsguid)
    const { register, handleSubmit, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
      })

      const UpdatePronouns = (e) => {
        setPronounsguid(e.target.value)
      }

      const updateValue = (e) => {
        setValue(e.target.name, e.target.value)
      }

      const handleFormSubmit = async (data) => {
        data['guid'] = props.data.guid
        data['larpRoles'] = props.data.larpRoles
        await currUserMutation.mutate(data)
        //await queryClient.removeQueries(['userList'])
        props.GoBack(true)
      }

    const currUserMutation = usePutData('/api/v1/Users/' + props.data.guid, ['currUserInfo', 'userList'])
    
  return (
      <div className="entryForm">
        <Form>
          <FormGroup>
            <FormLabel>Preferred Name:</FormLabel>
            <Input
              type="text"
              preferredname="preferredname"
              {...register('preferredname')}
              defaultValue={props.data.preferredname}
              onChange={(e) => updateValue(e)}
            />
            <br></br>
            <FormLabel >First Name:</FormLabel>
            <Input
              type="text"
              firstname="firstname"
              {...register('firstname')}
              defaultValue={props.data.firstname}
              onChange={(e) => updateValue(e)}
            />
            <FormLabel >Last Name:</FormLabel>
            <Input
              type="text"
              lastname="lastname"
              {...register('lastname')}
              defaultValue={props.data.lastname}
              onChange={(e) => updateValue(e)}
            />
            <br></br>
            <FormLabel >Pronouns:</FormLabel>
            <Select
            {...register('pronounsguid')}
            labelId="Pronouns"
            id="demo-simple-select"
            value={pronounsguid}
            label='Your Pronouns'
            onChange={(e) => UpdatePronouns(e)}>
            {props.pronoundata.map(option => (
             <MenuItem value={option.guid} key={option.guid}>{option.pronouns1}</MenuItem>
            ))
            }
            </Select>

            <br></br>
            <FormLabel >Registered Email:</FormLabel>
            <Input
              type="text"
              readOnly={true}
              email="email"
              {...register('email')}
              defaultValue={props.data.email}
            />
          </FormGroup>
<br></br>
          <Button color="primary" onClick={() => props.GoBack(false)}>
            Go Back!
            </Button>

          <br></br>
          <Button color="primary" onClick={handleSubmit(handleFormSubmit)}>
            Submit
          </Button>
        </Form>
      </div>
    )
    }

    UserSelfEditForm.propTypes = {
      GoBack: PropTypes.func,
      data:  PropTypes.object,
      pronoundata:  PropTypes.object
    }
