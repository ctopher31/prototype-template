import React, { Component } from 'react';
import PropTypes from 'prop-types';

const TextBox = ({ id, name, handleChange, formValuesText }) => (
  <input
    id={id}
    name={name}
    type="text"
    value={formValuesText}
    onChange={handleChange}
  />
);

TextBox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  formValuesText: PropTypes.string.isRequired,
};

const CheckBox = ({ id, name, handleChange, checkbox: { checked, value } }) => (
  <input
    id={id}
    name={name}
    type="checkbox"
    value={value}
    checked={(checked === true ? 'checked' : '')}
    onChange={handleChange}
  />
);

CheckBox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  checkbox: PropTypes.shape({
    checked: PropTypes.bool.isRequired,
    value: PropTypes.string.isRequired,
  }),
};

class SiteForm extends Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      formValues: {
        text: '',
        checkbox: {
          checked: false,
          value: 'checkbox1',
        },
        selectedOption: '',
      },
      fetchResponse: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    event.persist();
    switch (event.target.type) {
      case 'text':
        this.setState(prevState => ({
          formValues: {
            text: event.target.value,
            checkbox: {
              checked: prevState.formValues.checkbox.checked,
              value: prevState.formValues.checkbox.value,
            },
            selectedOption: prevState.formValues.selectedOption,
          },
          fetchResponse: prevState.fetchResponse,
        }));
        break;

      case 'checkbox':
        this.setState(prevState => ({
          formValues: {
            text: prevState.formValues.text,
            checkbox: {
              checked: !prevState.formValues.checkbox.checked,
              value: prevState.formValues.checkbox.value,
            },
            selectedOption: prevState.formValues.selectedOption,
          },
          fetchResponse: prevState.fetchResponse,
        }));
        break;

      case 'radio':
        this.setState(prevState => ({
          formValues: {
            text: prevState.formValues.text,
            checkbox: {
              checked: prevState.formValues.checkbox.checked,
              value: prevState.formValues.checkbox.value,
            },
            selectedOption: event.target.value,
          },
          fetchResponse: prevState.fetchResponse,
        }));
        break;

      default:
        break;
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    this.setState(prevState => ({
      formValues: {
        text: prevState.formValues.text,
        checkbox: {
          checked: prevState.formValues.checkbox.checked,
          value: prevState.formValues.checkbox.value,
        },
        selectedOption: prevState.formValues.selectedOption,
      },
      fetchResponse: prevState.fetchResponse,
    }));
    console.log('Submitted', this.state);
    // fetch('/', { method: 'POST', body: this.state.formValues })
    //   .then(response => response.json())
    //   .then((json) => {
    //     this.setState(prevState => ({
    //       formValues: {
    //         text: prevState.formValues.text,
    //         checkbox: {
    //           checked: prevState.formValues.checkbox.checked,
    //           value: prevState.formValues.checkbox.value,
    //         },
    //         selectedOption: prevState.formValues.selectedOption,
    //       },
    //       fetchResponse: json,
    //     }));
    //     console.log('Form Submitted!');
    //   });
  }

  render() {
    // console.log(this.state);
    return (
      <form id="site-form" className="site-form">
        <div className="form-group">
          <label htmlFor="input-1">Label 1</label>
          <TextBox
            id="input-1"
            name="textbox"
            formValuesText={this.state.formValues.text}
            handleChange={this.handleChange}
          />
        </div>
        <div className="form-group">
          <CheckBox
            id="input-2"
            name="checkbox"
            checkbox={this.state.formValues.checkbox}
            handleChange={this.handleChange}
          />
          <label htmlFor="input-2">Label 2</label>
        </div>
        <div className="form-group">
          <input id="input-3" name="radio-selection" type="radio" value="option1" checked={(this.state.formValues.selectedOption === 'option1' ? 'checked' : '')} onChange={this.handleChange} />
          <label htmlFor="input-3">Label 3</label>
        </div>
        <div className="form-group">
          <input id="input-4" name="radio-selection" type="radio" value="option2" checked={(this.state.formValues.selectedOption === 'option2' ? 'checked' : '')} onChange={this.handleChange} />
          <label htmlFor="input-4">Label 4</label>
        </div>
        <button className="btn btn-default" type="submit" onClick={this.handleSubmit}>Submit</button>
      </form>
    );
  }
}

export default SiteForm;
