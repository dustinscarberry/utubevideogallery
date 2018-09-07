import React from 'react';
import Tabs from './Tabs';
import Pane from './Pane';
import Card from './Card';

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
          <Pane label="Galleries" iconClass="fa-gear">
            <Card>
              <p>Galleries</p>
            </Card>
          </Pane>
          <Pane label="Playlists" iconClass="fa-gear">
            <Card>
              <p>Playlists</p>
            </Card>
          </Pane>
          <Pane label="Settings" iconClass="fa-gear">
            <Card>
              <p>Settings</p>
            </Card>
          </Pane>
          <Pane label="Status" iconClass="fa-gear">
            <Card>
              <p>Status</p>
            </Card>
          </Pane>
        </Tabs>
      </div>
    );
  }
}

export default Dashboard;
