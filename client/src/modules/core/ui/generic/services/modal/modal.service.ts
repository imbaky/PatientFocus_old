import * as _ from 'underscore';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
    private modals: any[] = [];

    // add modal to array of active modals
    add(modal: any) {
        this.modals.push(modal);
    }

    // remove modal from array of active modals
    remove(id: string) {
        const modalToRemove = _.findWhere(this.modals, { id: id });
        this.modals = _.without(this.modals, modalToRemove);
    }

    // open modal specified by id
    open(id: string) {
        const modal = _.findWhere(this.modals, { id: id });
        modal.open();
    }

    // close modal specified by id
    close(id: string) {
        const modal = _.find(this.modals, { id: id });
        modal.close();
    }

    getModals(): any[] {
        return this.modals;
    }
}
