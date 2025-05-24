const TableRowActions = ({actions}) => {
  const actionNodes = [];
  for (let i = 0; i < actions.length; i++) {
    if (i != 0)
      actionNodes.push(<span key={i + '-divider'} className="utv-row-divider">|</span>);

    if (actions[i].onClick)
      actionNodes.push(<a key={i} onClick={actions[i].onClick}>{actions[i].text}</a>);
    else if (actions[i].link)
      actionNodes.push(<a key={i} href={actions[i].link} target="_blank">{actions[i].text}</a>);
  }

  return <div className="utv-row-actions">{actionNodes}</div>
}

export default TableRowActions;
