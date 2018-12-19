import React from 'react';

const SubmitButton = ({title}) =>
{
  return <input type="submit" value={title} className="button-primary"/>;
}

export default SubmitButton;
