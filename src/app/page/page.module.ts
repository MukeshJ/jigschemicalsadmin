import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageListComponent } from './page-list/page-list.component';
import { PageRoutingModule } from './page-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ManagePageComponent } from './manage-page/manage-page.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { PageListPresentationComponent } from './page-list-presentation/page-list-presentation.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    PageListComponent,
    ManagePageComponent,
    PageListPresentationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PageRoutingModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule
  ]
})
export class PageModule { }
