import { Component, OnInit } from '@angular/core';

import { Label } from '../../../shared/services/label/label.service';

import { LabelService } from '../../../shared/services/label/label.service';

@Component({
  selector: 'document-labels',
  templateUrl: './document-labels.component.html',
  styleUrls: ['document-labels.component.scss']
})
export class DocumentLabelsComponent implements OnInit {

  labels: Label[];

  constructor(
    private labelService: LabelService
  ) { }

  ngOnInit() { 
    this.labelService.getAllLabels().subscribe((res: any) => {
      this.labels = res.labels;
    });
  }
}