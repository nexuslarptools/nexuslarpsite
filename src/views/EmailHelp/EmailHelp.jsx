import React from "react";
import emailjs from '@emailjs/browser';
import Loading from '../../components/loading/loading';
import getUserData from '../../utils/getcurrentuser';
import { useForm } from "react-hook-form"
import { Form, FormGroup } from "reactstrap";
import { Input, TextareaAutosize } from "@mui/material";

export default function ContactUs() {
    const currUserQuery = getUserData(); 
    const formRef = React.useRef();
    
    const { register, handleSubmit, setValue } = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange'
      })

      const updateValue = (e) => {
        setValue(e.target.name, e.target.value)
      }
      
  const sendEmail = (e) => {
    e. user_name = currUserQuery.data.preferredname;
    e. user_email = currUserQuery.data.email;

    emailjs.send('service_eckjenu', 'template_nxxyh9e', e, 'EvXbufAdk_v_rGnnp')
      .then(function(response) {
        console.log(response.text);
          window.location.reload() 
      }, function(error) {
          console.log(error.text);
      });
  }
  
  const handleFormSubmit = async (data) => {
    sendEmail(data)
  }

  if (currUserQuery.isLoading) return (<div>
     return (<><Loading /></>)
    </div>)
  if (currUserQuery.isError || (!currUserQuery.isError && currUserQuery.data === undefined)) return (<div>
    Error!
    </div>)

  return (
    <>
    <Form ref={formRef}>
        <FormGroup>
      <label>Name</label>
      <Input type="text" id="user_name" disabled={true} 
        {...register('user_name')} onChange={(e) => updateValue(e)}
        defaultValue={currUserQuery.data.preferredname} />
      <label>Email</label>
      <Input type="email" id="user_email" disabled={true} 
        {...register('user_email')} onChange={(e) => updateValue(e)}
        defaultValue={currUserQuery.data.email}/>
      <label>Subject</label>
      <Input type="text" id="subject"  {...register('subject', { required: true })} onChange={(e) => updateValue(e)}/>
      <label>Message</label>
      <TextareaAutosize id="message"  {...register('message', { required: true })} onChange={(e) => updateValue(e)}/>
      </FormGroup>
    </Form>
    <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Send</button>
    </>
  );
}