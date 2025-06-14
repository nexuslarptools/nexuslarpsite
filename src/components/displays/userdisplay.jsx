import PropTypes from 'prop-types'

const UserDisplay = (props) => {

return (
    <>
    <p>Name: {props?.data?.firstname} {props?.data?.lastname} </p>
    <p>Preferred Name: {props?.data?.preferredname}</p>
    <p>Email: {props?.data?.email} </p>
    <p>Pronouns: {props?.data?.pronouns} </p>
    <p>Roles:</p>
    {props?.data?.larpRoles.map((larp) =>
    <div key={Math.random()}>
    <p>Larp: {larp.larpName}</p>
    <p>Roles:</p>
    <div key={Math.random()}>
    {larp.roles?.map((role) =>
    <p key={Math.random()}>{role.roleName}</p> )}
    </div>
  <p>Claims: {props.claims  !== undefined ? props.claims  : ''} </p> 
    </div>
    )}
      <div className="edit-bottom">
      <button className="button-save" onClick={() => props.GoToEdit()}>Edit Profile</button>
      </div>
    </>
    )
    }

    export default UserDisplay


    UserDisplay.propTypes = {
      data: PropTypes.object,
      GoToEdit: PropTypes.func
  }