import { LabelService, Label } from './label.service';
import { inject, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Store } from '../../../../../app/store';
import { AuthInterceptor } from '../../interceptors/auth/auth.interceptor';

const okResponse = { status: 200, statusText: 'OK' };
const badResponse = { status: 400, statusText: 'BAD REQUEST ' };

describe('Label Service', () => {
  let service: LabelService;
  let http: HttpClient;
  let store: Store;

  beforeEach(() => {
    const bed = TestBed.configureTestingModule({
      providers: [
        LabelService,
        HttpClient,
        Store
      ],
      imports: [
        HttpClientTestingModule
      ]
    });
    http = bed.get(HttpClient);
    service = bed.get(LabelService);
    store = bed.get(Store);
  });

  it('GIVEN a named label THEN it should successfully create a label',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    // Setup
    const label: Label = {
      name: 'label',
      color: 'LightSteelBlue'
    };

    service.createLabel(label)
      .subscribe((result: any) => {
        expect(result.status).toBe(true);
    });

    const req = httpMock.expectOne('label');
    req.flush({ status: true }, okResponse);

    httpMock.verify();
  }));

  it('GIVEN existing labels THEN it should successfully fetch all labels',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    spyOn(store, 'set');
    const labels: Array<Label> = [
      {
        name: 'label',
        color: 'LightSteelBlue'
      },
      {
        name: 'label2',
        color: 'DarkSlateGray'
      }
    ];

    service.getAllLabels().subscribe((res: any) => {
      expect(res.labels.length).toBe(2);
    });

    const req = httpMock.expectOne('label');
    req.flush({ status: true, labels: labels }, okResponse);
    expect(store.set).toHaveBeenCalledWith('labels', labels);
  }));

});
