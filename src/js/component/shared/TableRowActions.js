import React from 'react';

const TableRowActions = ({actions}) =>
{
  let actionNodes = [];

  for (let i = 0; i < actions.length; i++)
  {
    if (i != 0)
      actionNodes.push(<span className="utv-row-divider">|</span>);

    if (actions[i].onClick)
      actionNodes.push(<a onClick={actions[i].onClick}>{actions[i].text}</a>);
    else if (actions[i].link)
      actionNodes.push(<a href={actions[i].link} target="_blank">{actions[i].text}</a>);
  }

  return (
    <div className="utv-row-actions">
      {actionNodes}
    </div>
  );
}

export default TableRowActions;
