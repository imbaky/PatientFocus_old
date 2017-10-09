import { browser, element, by } from 'protractor';
import { TestObject } from './test-object.interface';

export let Registration: TestObject = {
  elements: {
    getPageTitle: () => {
      return element(by.css('.register--header-title'));
    }
  },
  actions: {
    navigateTo: () => {
      return browser.get('/auth/register');
    }
  },
  assertions: {
    assertRegistrationTitle: () => {
      Registration.elements.getPageTitle().getText().then((title) => {
        expect(title).toBe('Register Now');
      });
    }
  }
};
