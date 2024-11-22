import PropTypes from "prop-types";
import { useState } from "react";

const HoverText = (props) => {
  const [hover, setHover] = useState(false);
  const onHover = () => {
    setHover(true);
  };

  const onLeave = () => {
    setHover(false);
  };
  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      role="button"
      tabIndex="-3"
    >
      {hover ? <><span style={{whiteSpace: "pre-line"}}>{props.hoverText}</span></> : props.plainText}
    </div>
  );
};

export default HoverText;

HoverText.propTypes = {
    hoverText: PropTypes.string,
    plainText: PropTypes.string
}
