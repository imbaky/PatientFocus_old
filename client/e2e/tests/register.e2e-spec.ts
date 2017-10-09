import { Registration } from '../objects/register.object';

describe('Registration', () => {

  const registrationTestObject = Registration;

  beforeEach(() => {
    registrationTestObject.actions.navigateTo();
  });

  it('should load the registration page', () => {
    registrationTestObject.assertions.assertRegistrationTitle();
  });

});
