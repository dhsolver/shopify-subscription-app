export const personalInfoFieldSet = {
  fields: [
    { field: 'first_name', required: true },
    { field: 'last_name', required: true },
  ],
  legend: 'Personal Info',
};

export const insertBillingIf = (model: any) => model.billing && !model.billing.is_same_as_shipping;

export const billingAddressFieldSet = {
  fields: [
    {
      className: 'chk-billing',
      editProps: {
        defaultChecked: true,
        description: 'Is Same as Shipping',
      },
      field: 'billing.is_same_as_shipping',
      label: '',
      type: 'checkbox',
      value: true,
    },
    { field: 'billing.first_name', insertIf: insertBillingIf },
    { field: 'billing.last_name', insertIf: insertBillingIf },
    { field: 'billing', type: 'address', insertIf: insertBillingIf },
  ],
  legend: 'Billing Address',
};

// TODO: seriously, why?
const emptyFieldSet = {fields: [], legend: ''};

export const shippingAddressFieldSet = {
  fields: [
    {field: 'first_name', required: true },
    {field: 'last_name', required: true },
    {field: 'shipping', type: 'address', required: true },
  ],
  legend: 'Shipping Address',
};

export const accountDetailsFieldSet = {
  fields: [
    {field: 'email', required: true},
    {field: 'phone', required: true, type: 'phone'},
    {field: 'password', required: true},
    {field: 'password_confirmation', writeOnly: true, label: 'Confirm Password', required: true },
  ],
  legend: 'Account Details',
};

export const accountFieldSets = [
  accountDetailsFieldSet,
  shippingAddressFieldSet,
  billingAddressFieldSet,
  emptyFieldSet,
];
