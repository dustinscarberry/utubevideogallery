import React from 'react';

class Form extends React.Component
{
  constructor(props)
  {
    super(props);

    this.state = {
      isValidated: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.validate = this.validate.bind(this);
  }

  validate()
  {
    let form = this.refs.form;

    if (form.checkValidity() === false)
    {
      for (let i = 0; i < form.length; i++)
      {
        let element = form[i];

        if (element.nodeName.toLowerCase() !== 'button')
        {
          if (!element.validity.valid)
          {
            let errorNode = element.parentNode.querySelector('.utv-invalid-feedback');

            if (errorNode)
              errorNode.remove();

            errorNode = document.createElement('span');
            errorNode.textContent = element.validationMessage;
            errorNode.className = this.props.errorclass;
            element.parentNode.insertBefore(errorNode, element.nextSibling);


          }
          else
          {
            let errorNode = element.parentNode.querySelector('.utv-invalid-feedback');

            if (errorNode)
              errorNode.remove();
          }
        }
      }

      return false;
    }
    else
    {
      for (let i = 0; i < form.length; i++)
      {
        let element = form[i];

        if (element.nodeName.toLowerCase() !== 'button')
        {
          let errorNode = element.parentNode.querySelector('.utv-invalid-feedback');

          if (errorNode)
            errorNode.remove();
        }
      }

      return true;
    }
  }

  onSubmit(event)
  {
    event.preventDefault();

    if (this.validate())
      this.props.action();

    this.setState({isValidated: true});
  }

  render()
  {
    let classNames = [];

    if (this.props.classes)
    {
      classNames = [...this.props.classes];
      //delete this.props.className;
    }

    if (this.state.isValidated)
      classNames.push('was-validated');

    return (
      <form
        ref="form"
        onSubmit={this.onSubmit}
        {...this.props}
        className={classNames}
        noValidate
      >
      </form>
    );
  }
}

export default Form;
