import classnames from 'classnames';
import PropTypes from 'prop-types';

const SelectBox = ({
  classes,
  name,
  value,
  onChange,
  choices = [],
  blankChoice = false
}) => {
  const options = choices.map(e =>
    <option key={e.value} value={e.value}>{e.name}</option>
  );

  if (blankChoice)
    options.unshift(<option key={'__blank'} value=""></option>);

  return <select
    name={name}
    className={classnames(classes)}
    value={value}
    onChange={onChange}
  >
    {options}
  </select>
}

SelectBox.propTypes = {
  classes: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  choices: PropTypes.array,
  blankChoice: PropTypes.bool
}


export default SelectBox;
