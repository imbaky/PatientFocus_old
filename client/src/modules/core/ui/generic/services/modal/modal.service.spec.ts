import { ModalService } from './modal.service';
import { TestBed } from '@angular/core/testing';

describe('Service: ModalService', () => {
    let service: ModalService;
    let modal: any;
    beforeEach(() => {
        const bed = TestBed.configureTestingModule({
            providers: [
                ModalService
            ]
        });
        service = bed.get(ModalService);
    });

    it('GIVEN that a modal is added THEN the array of modals should be incremented', () => {
        modal = {} as any;
        service.add(modal);
        expect(service.getModals().length).toBe(1);
    });
    it('GIVEN that a modal is added and removed THEN the array of modals size will not be changed', () => {
        modal = { id: 'Test modal' } as any;
        service.add(modal);
        service.remove(modal.id);
        expect(service.getModals().length).toBe(0);
    });

    it('GIVEN that a modal is created and opened THEN the modal appears', () => {
        modal = {
            id: 'Test modal',
            open: jasmine.createSpy('open')
        } as any;

        service.add(modal);
        service.open('Test modal');

        expect(modal.open).toHaveBeenCalled();
    });
});
