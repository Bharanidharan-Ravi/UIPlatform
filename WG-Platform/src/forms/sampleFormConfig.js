export const sampleFormConfig = {
  ui: 'mui',
  formType: 'formik',
  initialValues: {
    firstName: '',
    age: '',
    country: '',
    state: '',
    newsletter: false,
    promoCode: '',
    secret: ''
  },
  fields: [
    {
      name: 'firstName',
      label: 'First name',
      type: 'text',
      validation: { required: true, minLength: 2, maxLength: 30, textOnly: true }
    },
    {
      name: 'age',
      label: 'Age',
      type: 'number',
      validation: { required: true, min: 0, max: 120 }
    },
    {
      name: 'country',
      label: 'Country',
      type: 'select',
      placeholder: 'Choose a country',
      options: [
        { label: 'United States', value: 'USA' },
        { label: 'Canada', value: 'CAN' }
      ],
      validation: { required: true }
    },
    {
      name: 'state',
      label: 'State (shown only for USA)',
      type: 'text',
      dependsOn: { field: 'country', value: 'USA', action: 'show' },
      validation: { required: true }
    },
    {
      name: 'newsletter',
      label: 'Subscribe to newsletter',
      type: 'checkbox',
      dependsOn: { field: 'age', value: 18, action: 'disable' }
    },
    {
      name: 'promoCode',
      label: 'Promo code (disabled for Canada)',
      type: 'text',
      dependsOn: { field: 'country', value: 'CAN', action: 'disable' }
    },
    {
      name: 'secret',
      label: 'Secret code (regex: 3 uppercase letters + 3 digits)',
      type: 'password',
      validation: { pattern: '^[A-Z]{3}\\d{3}$', patternMessage: 'Must be 3 uppercase letters followed by 3 digits' }
    }
  ]
  ,
  validationSchema: {
    fields: [
      { name: 'firstName', validation: { required: true, minLength: 2 } },
      { name: 'secret', validation: { pattern: '^[A-Z]{3}\\d{3}$' } }
    ]
  }
};

export default sampleFormConfig;
