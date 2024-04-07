import PropTypes from 'prop-types';
import './tags.scss';

const Tags = props => {

   
let filteredTags = [];
let filteredGuids = [];
props.tags.forEach(ele => {
  if (!filteredGuids.includes(ele.guid)) {
    filteredGuids.push(ele.guid);
    filteredTags.push(ele);
  }
});


  if (!props.tags) {
    return <div></div>
  } else if (props.clickable === true) {
    return (
      <ul className="tagslist">
        {filteredTags.map(tag => {
          return (
            <li key={tag.guid} className={'tag'} onClick={() => props.tagClick(tag.guid)} >{tag.name} </li>
          )
        }, this)}
      </ul>
    )
  } else {
    return (
      <ul className="tagslist">
        {filteredTags.map(tag => {
          return (
            <li key={tag.guid} className={'tag'} >{tag.name} </li>
          )
        }, this)}
      </ul>
    )
  }
}

export default Tags;

Tags.propTypes = {
  tags: PropTypes.array,
  clickable: PropTypes.bool,
  tagClick: PropTypes.func
}