import { NavLink } from "react-router-dom";


const ContactFooter = () => {

    return (
        <footer className='footer-container'>
          <div className='footer-items'>
            <NavLink to="/contactus">Contact Us</NavLink>
          </div>
        </footer>
    )
}

export default ContactFooter;