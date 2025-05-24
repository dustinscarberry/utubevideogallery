import classnames from 'classnames';

const Cell = ({data, classes, columnName}) => {
  return <td className={classnames(classes)} data-columnname={columnName}>
    {data}
  </td>
}

export default Cell;
