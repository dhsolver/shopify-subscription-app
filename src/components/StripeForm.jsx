import React, {Component} from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCVCElement,
  injectStripe,
  StripeProvider,
  Elements,
} from 'react-stripe-elements';
import { Card, Form } from 'antd';

import Button from './common/Button';
import ButtonToolbar from './common/ButtonToolbar';
import Spacer from './common/Spacer';

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

  renderButtonToolbar () {
    return (
      <ButtonToolbar align='right'>
        <Button onClick={this.props.handleCancel}>Cancel</Button>
        <Button type='primary' onClick={this.handleSubmit}>Submit</Button>
      </ButtonToolbar>
    );
  }

  render() {
    const { isAccountPage } = this.props;

    return (
      <div>
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
          <Spacer />
          
          {isAccountPage && this.renderButtonToolbar()}
        </Form>
      </div>
    );
  }
}

const SplitFieldsForm = injectStripe(_SplitFieldsForm);

export default class SplitFieldsDemo extends Component {
  render() {
    const { isAccountPage } = this.props;
    return (
      <StripeProvider apiKey={this.props.stripePublicKey}>
        <Elements>
          <SplitFieldsForm
            getStripeFormRef={this.props.getStripeFormRef}
            handleCancel={this.props.handleCancel}
            handleResult={this.props.handleResult}
            isAccountPage={isAccountPage}
          />
        </Elements>
      </StripeProvider>
    );
  }
}