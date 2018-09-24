import React from 'react';

const TableRowActions = ({actions}) =>
{
  let actionNodes = [];

  for (let action of actions)
  {
    if (action.onClick)
      actionNodes.push(<span onClick={action.onClick}>{action.text}</span>);
    else if (action.link)
      actionNodes.push(<a href={action.link} target="_blank">{action.text}</a>);
    else
      actionNodes.push(<span>{action.text}</span>);//remove this one after testing phase
  }

  return (
    <div>
      {actionNodes}
    </div>
  );
}

export default TableRowActions;
