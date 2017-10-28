import { Component } from '@angular/core';
import { Store } from '../../../../../../app/store';

export interface DashboardNavLink {
  icon: string;
  label: string;
  url: string;
}

@Component({
  selector: 'px-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  constructor(
    private store: Store
  ) {}

  get user$ () {
    return this.store.select('user');
  }

  links: Array<DashboardNavLink> = [
    { icon: '/assets/images/icons/profile.svg', label: 'Main', url: '/patient'},
    { icon: '/assets/images/icons/document.svg', label: 'Documents', url: '/patient/document'},
  ];

}
