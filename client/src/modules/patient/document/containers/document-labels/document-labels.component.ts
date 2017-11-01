import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

import { Label } from '../../../shared/services/label/label.service';
import { LabelService } from '../../../shared/services/label/label.service';

@Component({
  selector: 'document-labels',
  templateUrl: './document-labels.component.html',
  styleUrls: ['document-labels.component.scss']
})
export class DocumentLabelsComponent implements OnInit {

  labels$: Observable<Label[]>;
  search = new FormControl('');

  get value(){
    return this.search.value;
  }

  constructor(
    private labelService: LabelService
  ) { }

  ngOnInit() {
    this.labels$ = this.labelService.getAllLabels();
  }
}
