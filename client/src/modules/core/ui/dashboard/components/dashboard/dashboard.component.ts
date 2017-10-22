import { Component } from '@angular/core';

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

  links: Array<DashboardNavLink> = [
    { icon: '/assets/images/icons/profile.svg', label: 'Main', url: '/patient'},
    { icon: '/assets/images/icons/document.svg', label: 'Documents', url: '/patient/document'},
  ];

}
