import PropTypes from 'prop-types';
import "./_formattedText.scss";

function FormattedText(props, children) {
    if (props.style !== undefined && props.style !== null) {
      return (<span className={props.style}>{props.children}</span>)
    }
    return (<span>{props.children}</span>)
}

export default FormattedText;

FormattedText.PropTypes = {
  style: PropTypes.string,
  children: PropTypes.string
}