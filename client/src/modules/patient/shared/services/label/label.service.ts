import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { Store } from '../../../../../app/store';

export interface Label {
  id?: number;
  name: string;
  color: string;
}

@Injectable()
export class LabelService {

  constructor(
    private http: HttpClient,
    private store: Store
  ) { }

  /**
   * Creates a label
   * @param label {Label}
   * @returns {Observable<any>}
   */
  createLabel(label: Label): Observable<any> {
    return this.http.post('label', label)
      .do((res: any) => {
        if (res.label) {
          this.store.select('labels').subscribe((labels: any) => {
            labels.push(res.label);
            this.store.set('labels', labels);
          });
        }
      })
      .catch((err) => Observable.throw(err));
  }

  /**
   * Gets all available labels
   * @returns {Observable<T>}
   */
  getAllLabels(): Observable<any> {
    return this.http.get('label')
      .do((res: any) => {
        if (res.labels) {
          this.store.set('labels', res.labels);
        }
      })
      .catch((err) => Observable.throw(err));
  }
}
