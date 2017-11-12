import { LabelService, Label } from './label.service';
import { inject, TestBed } from '@angular/core/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Store } from '../../../../../app/store';

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
    const labels: Label[] = [
      {
        id: 1,
        name: 'label',
        color: 'YellowGreen'
      },
      {
        id: 2,
        name: 'label2',
        color: 'DarkSlateGray'
      }
    ];

    const label: Label = {
      id: 3,
      name: 'label3',
      color: 'LightSteelBlue'
    };

    const newLabels: Label[] = [
      {
        id: 1,
        name: 'label',
        color: 'YellowGreen'
      },
      {
        id: 2,
        name: 'label2',
        color: 'DarkSlateGray'
      },
      {
        id: 3,
        name: 'label3',
        color: 'LightSteelBlue'
      }
    ];

    store.set('labels', labels);
    spyOn(store, 'set');

    service.createLabel(label).subscribe();

    const req = httpMock.expectOne({
      url: '/label',
      method: 'POST'
    });
    req.flush({labels: label}, okResponse);

    httpMock.verify();
  }));

  it('GIVEN existing labels THEN it should successfully fetch all labels',
    inject([HttpTestingController], (httpMock: HttpTestingController) => {
    spyOn(store, 'set');
    const labels: Label[] = [
      {
        id: 1,
        name: 'label',
        color: 'LightSteelBlue'
      },
      {
        id: 2,
        name: 'label2',
        color: 'DarkSlateGray'
      }
    ];

    service.getAllLabels().subscribe((labelsRes: Label[]) => {
      expect(labelsRes.length).toBe(2);
    });

    const req = httpMock.expectOne('/label');
    req.flush({labels: labels}, okResponse);
    httpMock.verify();
    expect(store.set).toHaveBeenCalledWith('labels', labels);
  }));

});
