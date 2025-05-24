import { Component, createRef } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Form extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      isValidated: false
    };

    this.form = createRef();
  }

  validate = () => {
    let form = this.form.current;
    let formValid = form.checkValidity() || false;

    for (let i = 0; i < form.length; i++) {
      let element = form[i];

      if (element.nodeName.toLowerCase() !== 'button') {
        if (!formValid && !element.validity.valid) {
          let errorNode = element.parentNode.querySelector('.utv-invalid-feedback');

          if (errorNode)
            errorNode.remove();

          errorNode = document.createElement('span');
          errorNode.textContent = element.validationMessage;
          errorNode.className = this.props.errorclass;
          element.parentNode.insertBefore(errorNode, element.nextSibling);
        } else {
          let errorNode = element.parentNode.querySelector('.utv-invalid-feedback');

          if (errorNode)
            errorNode.remove();
        }
      }
    }

    return formValid;
  }

  onSubmit = (e) => {
    e.preventDefault();

    if (this.validate() && this.props.submit)
      this.props.submit();

    this.setState({isValidated: true});
  }

  render() {
    const { classes } = this.props;
    const { isValidated } = this.state;

    return <form
      ref={this.form}
      onSubmit={this.onSubmit}
      className={classnames(classes, {'was-validated': isValidated})}
      noValidate
    >
      {this.props.children}
    </form>
  }
}

export default Form;
