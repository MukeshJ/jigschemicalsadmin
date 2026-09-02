import { Routes } from '@angular/router';
import { DocumentPermissionListComponent } from './document-permission-list/document-permission-list.component';

export const routes: Routes = [
    {
        path: ':id',
        component: DocumentPermissionListComponent,
    }
];
