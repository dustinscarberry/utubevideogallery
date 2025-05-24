import classnames from 'classnames';
import PropTypes from 'prop-types';

const InfoLine = ({text, icon, isHTML}) => {
  const classes = ['utv-infoline'];

  if (icon) {
    classes.push('utv-status');

    if (icon == 'active')
      classes.push('utv-status-active');
    else if (icon == 'inactive')
      classes.push('utv-status-inactive');
    else if (icon == 'warning')
      classes.push('utv-status-warning');
  }

  return <span className={classnames(classes)}>
    { isHTML ? <span dangerouslySetInnerHTML={{ __html: text }}></span> : text }
  </span>
}

InfoLine.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.string,
  isHTML: PropTypes.bool
}

export default InfoLine;
