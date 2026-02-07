function generateFakeValue(field) {
  const name = (field.name || '').toLowerCase();

  if (name.includes('email')) return 'testuser@example.com';
  if (name.includes('username') || name.includes('user')) return 'testuser';
  if (name.includes('fullname') || name.includes('name')) return 'John Doe';
  if (name.includes('pass')) return 'FakePass123!';
  if (name.includes('otp') || name.includes('code')) return '123456';

  // phone
  if (name.includes('phone') || name.includes('mobile')) return '9999999999';

  // card details
  if (name.includes('card') && name.includes('name')) return 'John Doe';
  if (name.includes('card')) return '4111111111111111';
  if (name.includes('expiry') || name.includes('exp') || name.includes('valid'))
    return '12/29';
  if (name.includes('cvv') || name.includes('cvc')) return '123';
  if (name.includes('pin')) return '1234';

  // banking
  if (name.includes('account')) return '123456789012';
  if (name.includes('ifsc') || name.includes('routing')) return 'TEST0001234';

  // government / id
  if (name.includes('aadhaar') || name.includes('ssn') || name.includes('id'))
    return '123412341234';
  if (name.includes('pan') || name.includes('tax')) return 'ABCDE1234F';
  if (name.includes('dob') || name.includes('birth')) return '01/01/1995';

  // address
  if (name.includes('address')) return '123 Test Street';
  if (name.includes('city')) return 'Test City';
  if (name.includes('state')) return 'Test State';
  if (name.includes('zip') || name.includes('postal') || name.includes('pincode'))
    return '123456';

  return 'test';
}

module.exports = { generateFakeValue };
