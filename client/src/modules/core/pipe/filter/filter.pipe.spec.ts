import { FilterPipe } from './filter.pipe';

class MockElement {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

describe('FilterPipe', () => {
  const filterPipe = new FilterPipe();
  const arr = [];
  let filteredArr = [];

  arr.push(new MockElement('Patient'));
  arr.push(new MockElement('Medical'));
  arr.push(new MockElement('Doctor'));
  arr.push(new MockElement('Docker'));

  beforeEach(() => {
    filteredArr = arr;
  });

  it('GIVEN null elements THEN it should return null', () => {
    filteredArr = filterPipe.transform(null, '', 'name');
    expect(filteredArr).toBeNull();

  });
  it('GIVEN no search term THEN it should return the elements', () => {
    filteredArr = filterPipe.transform(arr, '', 'name');
    expect(arr.length).toBe(4);
  });

  it('GIVEN a non-matching search term THEN it should not return anything', () => {
    filteredArr = filterPipe.transform(arr, 'nothing', 'name');
    expect(filteredArr.length).toBe(0);
  });

  it('GIVEN a matching search term THEN it should return the filtered elements', () => {
    filteredArr = filterPipe.transform(arr, 'Doc', 'name');
    expect(filteredArr.length).toBe(2);
  });
});
