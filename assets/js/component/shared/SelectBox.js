import React from 'react';
import classnames from 'classnames';

const SelectBox = ({classes, name, value, onChange, data = [], blankEntry = false}) =>
{
  //create options
  const options = data.map(e =>
    <option key={e.value} value={e.value}>{e.name}</option>
  );

  //add empty option
  if (blankEntry)
    options.unshift(<option key={'__blank'} value=""></option>);

  return (
    <select
      name={name}
      className={classnames(classes)}
      value={value}
      onChange={onChange}
    >
      {options}
    </select>
  );
}

export default SelectBox;
