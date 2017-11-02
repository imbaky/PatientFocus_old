import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('colorPicker')
  colorPicker: ElementRef;

  search = new FormControl('');
  color = new FormControl('#' + Math.floor(Math.random() * 16777215).toString(16)); // random hex color
  labels$: Observable<Label[]>;

  constructor(
    private labelService: LabelService
  ) { }

  createLabel() {
    this.labelService.createLabel({ name: this.search.value, color: this.color.value })
      .subscribe((newLabel: Label) => {
          this.labels$ = this.labelService.getAllLabels();
      });
  }

  openColorPicker() {
    this.colorPicker.nativeElement.click();
  }

  ngOnInit() {
    this.labels$ = this.labelService.getAllLabels();
  }
}
