import React from 'react';
import Tabs from './Tabs';
import Pane from './Pane';

class Dashboard extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return (
      <div className="wrap utv-admin">
        <h2 id="utv-masthead">uTubeVideo</h2>


        <Tabs selected={0}>
          <Pane label="General" iconClass="fa-gear">
            <p>Hi Pane</p>
          </Pane>
          <Pane label="General2" iconClass="fa-gear">
            <p>Hi Pane 2</p>
          </Pane>
        </Tabs>
      </div>
    );
  }
}

export default Dashboard;
