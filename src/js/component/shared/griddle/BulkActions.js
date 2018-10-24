import React from 'react';

class BulkActions extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      selectedAction: undefined
    };
  }

  onChange(e)
  {
    this.setState({selectedAction: e.target.value});
    console.log(this.state.selectedAction);
  }

  render()
  {
    let options = this.props.actionData.options.map((e) => {
      return <option value={e.key}>{e.name}</option>;
    });

    return (
      <div className="ccgriddle-table-page-actions">
        <select className="form-control" value={this.state.selectedAction} onChange={this.onChange}>
          {options}
        </select>
        <button>Apply</button>
      </div>
    );
  }

}

export default BulkActions;
