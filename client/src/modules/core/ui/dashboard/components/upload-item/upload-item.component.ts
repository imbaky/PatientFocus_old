import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  UploadFile, UploadProgress, UploadStatus
} from '../../../../../patient/shared/services/document/document.service';

@Component({
  selector: 'px-upload-item',
  templateUrl: 'upload-item.component.html',
  styleUrls: ['upload-item.component.scss']
})
export class UploadItemComponent {

  UploadStatus = UploadStatus;

  @Input()
  item;

  @Input()
  state;

  @Output()
  onRetryUpload = new EventEmitter<UploadFile>();

  @Output()
  onCancelUpload = new EventEmitter<UploadFile>();

  getStateTitle() {
    switch (this.item.status) {
      case UploadStatus.DONE:
        return 'Completed';
      case UploadStatus.QUEUING:
        return 'In Queue';
      case UploadStatus.ERROR:
        return 'Failed to Upload';
      case UploadStatus.UPLOADING:
        return 'Uploading ' + this.state.current + ' of ' + this.state.total;
    }
    return 'Pending...';
  }

  cancelItem() {
    this.onCancelUpload.emit(this.item);
  }

  retryItem() {
    this.onRetryUpload.emit(this.item);
  }

}
