import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  /**
   * @param elements  - Array of elements to be filtered
   * @param term      - Search term
   * @param key       - Object key
   * @returns {Array} - Filtered array
   */
  transform(elements: Array<any>, term: string, key: string): Array<any> {
    if (!term || !elements) {
      return elements;
    }

    return elements.filter(element => {
      return element[key].toLowerCase().includes(term.toLowerCase());
    });
  }
}
