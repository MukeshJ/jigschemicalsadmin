import { Routes } from '@angular/router';
import { InventoryListComponent } from './inventory-list/inventory-list.component';


export const routes: Routes = [
  {
    path: '',
    component: InventoryListComponent,
    // data: { claimType: 'invetory_view_invetories' },
    // canActivate: [AuthGuard]
  },
];
