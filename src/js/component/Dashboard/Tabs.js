import React from 'react';

class Tabs extends React.Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      selected: this.props.selected || 0
    };

    this.cleanChildren = this.cleanChildren.bind(this);
    this.generateLabels = this.generateLabels.bind(this);
  }

  cleanChildren()
  {
    if (Array.isArray(this.props.children))
      return this.props.children;

    return [this.props.children];
  }

  generateLabels(child, index)
  {
    let activeClass = (this.state.selected === index ? 'tab-current' : '');
    let iconClass = child.props.iconClass || '';

    return (
      <li key={index} className={activeClass} onClick={this.handleClick.bind(this, index)}>
        <a href="#" className={iconClass}>
          {child.props.label}
        </a>
      </li>
    );
  }

  handleClick(index, event)
  {
    event.preventDefault();
    this.setState({
      selected: index
    });
  }

  renderTitles()
  {
    let children = this.cleanChildren();

    return (
      <nav className="tabs-nav">
        <ul>
          {children.map(this.generateLabels)}
        </ul>
      </nav>
    );
  }

  renderContent()
  {
    let children = this.cleanChildren();

    return (
      <section className="tabs-content">
        {children[this.state.selected]}
      </section>
    );
  }

  render()
  {
    return (
      <div className="tabs">
        {this.renderTitles()}
        {this.renderContent()}
      </div>
    );
  }
}

export default Tabs;
