import React, {Component} from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import { Form } from 'antd';

// TODO: style
const createOptions = () => {
  return {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        letterSpacing: '0.025em',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#c23d4b',
      },
    },
  };
};

class _SplitFieldsForm extends Component {
  state = {
    errorMessage: '',
  };

  handleChange = ({error}) => {
    if (error) {
      this.setState({errorMessage: error.message});
    }
  };

  handleSubmit = async (evt) => {
    evt.preventDefault();
    if (this.props.stripe) {
      await this.props.stripe.createToken().then((token) => this.props.handleResult(token));
    } else {
      console.error("Stripe.js hasn't loaded yet.");
    }
  };

  render() {
    return (
      <Form ref={this.props.getStripeFormRef} onSubmit={this.handleSubmit.bind(this)}>
        <div className="split-form">
          <label>
            Card number
            <CardNumberElement
              {...createOptions()}
              onChange={this.handleChange}
              className='ant-input'
            />
          </label>
          <label>
            Expiration date
            <CardExpiryElement
              {...createOptions()}
              onChange={this.handleChange}
              className='ant-input'
            />
          </label>
        </div>
        <div className="split-form">
          <label>
            CVC
            <CardCVCElement {...createOptions()} onChange={this.handleChange} className='ant-input'/>
          </label>
          <label>
            Postal code
            <input
              name="name"
              type="text"
              placeholder="94115"
              className="ant-input"
              required
            />
          </label>
        </div>
        <div className="error" role="alert">
          {this.state.errorMessage}
        </div>
      </Form>
    );
  }
}

const SplitFieldsForm = injectStripe(_SplitFieldsForm);

export default class SplitFieldsDemo extends Component {
  render() {
    return (
      <StripeProvider apiKey={this.props.stripePublicKey}>
        <Elements>
          <SplitFieldsForm getStripeFormRef={this.props.getStripeFormRef} handleResult={this.props.handleResult} />
        </Elements>
      </StripeProvider>
    );
  }
}