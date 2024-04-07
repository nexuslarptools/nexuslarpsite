import React, { useState } from "react"
import { Button, FormLabel, DialogContent, Typography, DialogActions, Dialog, DialogTitle, IconButton, Input } from "@mui/material"
import { Form, FormGroup } from 'reactstrap'
import { useForm } from "react-hook-form"
import usePutData from "../../utils/putdata"
import useGetData from "../../utils/getdata"
import { useQueryClient } from "@tanstack/react-query"
import LarpRoleAdder from "../larproleadder/larproleadder"
import RolesTable from "../tables/rolestable"
import PropTypes from 'prop-types'
import Loading from "../loading/loading"

export default function UserRolesEditForm(props) {
  const formRef = React.useRef();
  const [formData, setFormData] = useState({
        data: props.data
    })
    const [removingRolesDialogState, setRemovingRolesDialogState] = useState(false);

    const { register, handleSubmit, setValue } = useForm({
      mode: 'onSubmit',
      reValidateMode: 'onChange'
    });

    const queryClient = useQueryClient();

      const handleFormSubmit = async (data) => {
        let mutData = data;
        const larproleList = [];
        formData.data.larpRoles.forEach((larprole) => {
        larprole.roles.forEach((role) => {
        larproleList.push({
        larpguid: larprole.larpGuid,
        role: { id: role.roleID, rolename: role.rolename }
        });
      });
    });
    mutData.guid = formData.data.guid;
    mutData.pronounsguid = formData.data.pronounsguid;
    mutData.userLarproles = larproleList;


        await currUserMutation.mutate(mutData)
        props.GoBack(true)
      }

  // update input value states
  const updateValue = (e) => {
    setValue(e.target.name, e.target.value);
  }

    // set pronouns state
    const UpdatePronouns = (e) => {
      let updatedata = formData.data;
      updatedata.pronounsguid = e.target.value;

      setFormData({
        ...formData,
        data: updatedata
      })
      setValue(e.target.name, e.target.value);
      e.target.size = 1;
      e.target.blur();

    }

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

    const AddRole = async (e) => {
      const mutFormData = formData.data
      const addedLarp = larpData.data.find((LARP) => LARP.guid === e.larpSelector)
      const addedRole = rolesData.data.find((role) => role.roleID === parseInt(e.roleSelector))

      const newLARProleObject = {
         larpGuid: addedLarp.guid,
         larpName: addedLarp.name, 
           roles : []
        }

     const newRole = {
            roleID: addedRole.roleID,
            roleName: addedRole.roleName
           }

     const larpDataExist = mutFormData.larpRoles.find((larpRole) => larpRole.larpGuid === addedLarp.guid)
     if (larpDataExist === undefined || larpDataExist === null) {
        newLARProleObject.roles.push(newRole)
        mutFormData.larpRoles.push(newLARProleObject)
     }
     else {
        const roleDataExist = larpDataExist.roles.find((role) => role.roleID === addedRole.roleID)
        if  (roleDataExist === undefined || roleDataExist === null) {
        larpDataExist.roles.push(newRole)
        }
     }
     await setFormData({
        ...formData,
        data: mutFormData
    })
}
  const RemoveRole = async (e, f) => {
    const mutFormData = formData.data
    const larpDataExist = mutFormData.larpRoles.find((larpRole) => larpRole.larpGuid === e)
    var larpIndex = mutFormData.larpRoles.indexOf(larpDataExist)
    const roleDataExist = larpDataExist.roles.find((role) => role.roleID === f)
    var roleindex = larpDataExist.roles.indexOf(roleDataExist)

    if (larpDataExist.roles.length === 1) {
        mutFormData.larpRoles.splice(larpIndex , 1)
    }
    else {
        mutFormData.larpRoles[larpIndex].roles.splice(roleindex, 1)
    }

    await setFormData({
        ...formData,
        data: mutFormData
    })

  }

  const submitFormGood = (e) => {
    e.preventDefault();
    handleSubmit(handleFormSubmit)();
  }

  //closes dialog box
  const handleDeleteClose = () => {
    setRemovingRolesDialogState(false);
  }

  const GoBack = async () => {
    await queryClient.invalidateQueries({
        queryKey: ['userList'],
        refetchType: 'all' })
    //await queryClient.removeQueries('userList')
    //await queryClient.invalidateQueries(['userList']);
    props.GoBack()
  }
    
  
  const larpData = useGetData('larpsList', '/api/v1/LARPS');
  const rolesData = useGetData('rolesList', '/api/v1/Roles');
  const pronounsData = useGetData('pronounsList', '/api/v1/Pronouns');
  const currUserMutation = usePutData('/api/v1/Users/' + formData.data.guid, ['currUserInfo', 'userList']);
    
    if (larpData.isLoading || rolesData.isLoading || pronounsData.isLoading) return (<div>
        <Loading />
        </div>)
    if (larpData.isError || rolesData.isError || pronounsData.isError) return (<div>
        Error!
        </div>)

return (
  <>
    <header className="header">Edit User Details</header>
    <div className="entryForm">
      <Form ref={formRef}>
        <FormGroup>
          <div className="input-pair">
            <FormLabel htmlFor="preferredname">Preferred Name:</FormLabel>
            <Input
              type="text"
              preferredname="preferredname"
              {...register('preferredname')}
              defaultValue={formData.data.preferredname}
              onChange={(e) => updateValue(e)}
            />
          </div>
          <div className="input-pair">
            <FormLabel htmlFor="firstname" required>First Name:</FormLabel>
            <Input required
              type="text"
              firstname="firstname"
              {...register('firstname')}
              defaultValue={formData.data.firstname}
              onChange={(e) => updateValue(e)}
            />
          </div>
          <div className="input-pair">
            <FormLabel htmlFor="lastname" required>Last Name:</FormLabel>
            <Input required
              type="text"
              lastname="lastname"
              {...register('lastname')}
              defaultValue={formData.data.lastname}
              onChange={(e) => updateValue(e)}
            />
          </div>
          <div className="input-pair">
            <FormLabel htmlFor="pronouns">Pronouns:</FormLabel>
            <select className={formData.data.pronouns == null || formData.data.pronouns == 'default' ? 'selector pronounselector defaulted' : 'selector pronounselector'}
              {...register('pronouns')}
              defaultValue={formData.data.pronouns !== null ? 
                pronounsData.data.find((pronoun) => formData.data.pronouns === pronoun.pronouns).guid : 'default'}
              onChange={(e) => UpdatePronouns(e)}
              onFocus={(e) => focused(e, pronounsData.data.length)}
              onBlur={(e) => blurred(e)}
              onKeyUp={(e) => e.code === "Escape" ? blurred(e) : null}>
              <option className="select-default" key='default' value='default'>select preferred pronouns</option>
              {pronounsData.data.map((obj) => {
                return (
                  <>
                    { obj.guid !== null
                      ? <option className={'pronoun'} key={obj.guid} value={obj.guid}>
                        {obj.pronouns}
                      </option>
                      : undefined
                    }
                  </>
                )
              })}
            </select>
          </div>
          <div className="input-pair">
            <FormLabel htmlFor="email">Registered Email:</FormLabel>
            <Input disabled
              type="text"
              readOnly={true}
              email="email"
              {...register('email')}
              defaultValue={formData.data.email}
            />
          </div>
        </FormGroup>

        { !props.isSelfEdit ?
        <>
        <header className="header">Edit User LARP Roles</header>
        <div className='permissions-group'>
          <LarpRoleAdder
            larpData={larpData.data}
            rolesData={rolesData.data}
            AddLarpRole={(e) => AddRole(e)}>
          </LarpRoleAdder>            
        </div>
        <div className="input-pair">
          <FormLabel>Role Meanings:</FormLabel>
          <div className="info-list">
            <ul>
              <li><b>Reader</b>: Read access to items and sheets, but cannot edit or create anything. Cannot see any unapproved items or sheets.</li>
              <li><b>Writer</b>: Access to edit and create both items and sheets, and so can see unapproved items and sheets.</li>
              <li><b>Approver</b>: Can edit, create, and approve sheets and items. Any sheet or item requires two approvals to send it to the approved list.</li>
              <li><b>Head GM</b>: All of the access above, but also has access to edit information about the LARP(s) they run, including users connected to their LARP and larp-linked tags.</li>
              <li><b>Wizard</b>: Magic. Can do literally anything and everything needed for this system no matter what LARP(s) they are actually a part of.</li>
            </ul>
          </div>
        </div>
        <div className="input-pair">
          <FormLabel>Current User LARPs and Roles:</FormLabel>
          { formData.data.larpRoles.length !== 0 
            ? <div className="table-roles">
                {formData.data.larpRoles.map((sublist) => {
                  return (
                    <RolesTable
                      authLevel={props.authlevel}
                      props={sublist}
                      key={Math.random()}
                      edit={true}
                      RemoveCommand={(e, f) => RemoveRole(e, f)}
                    />
                  )
                })}
              </div>
            : <div className="empty-message"><b>This user is not assigned to any LARPs currently.</b> If you want this user to have a role but not be in any specific LARP, choose &lsquo;Nexus&lsquo; in the LARPs above, then the desired role.</div>
          }
        </div> 
        </>
        : <></> }
      </Form>
    </div>
    <div className="edit-bottom">
      <button className="button-cancel" onClick={() => GoBack()}>Cancel</button>
      <button className="button-save" onClick={handleSubmit(handleFormSubmit)}>Submit Changes</button>
    </div>
    {  removingRolesDialogState
        ? <>
          <Dialog
            onClose={() => handleDeleteClose()}
            aria-labelledby="customized-dialog-title"
            open={removingRolesDialogState}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
              Warning!
            </DialogTitle>
            <IconButton
              aria-label="close"
              onClick={() => handleDeleteClose()}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: (theme) => theme.palette.grey[500]
              }}>
            </IconButton>
            <DialogContent dividers>
              <Typography gutterBottom>
                You are removing roles from this user.  Are you SURE you want to do this?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => handleDeleteClose()}>No</Button>
              <Button onClick={(e) => submitFormGood(e)}>Yes</Button>
            </DialogActions>
          </Dialog>
        </>
        : <div></div>
      }
  </>
)
}

UserRolesEditForm.propTypes = {
  GoBack: PropTypes.func,
  data:  PropTypes.object,
  isSelfEdit: PropTypes.bool,
  authlevel: PropTypes.number
}