import React from 'react';
import classnames from 'classnames';

const SelectBox = ({classes, name, value, onChange, data = [], blankEntry = false}) =>
{
  //add empty option
  if (blankEntry)
    data.unshift({name: '', value: ''});

  const options = data.map(e =>
    <option key={e.value} value={e.value}>{e.name}</option>
  );

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
