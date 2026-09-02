import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndustryDetailComponent } from './industry-detail/industry-detail.component';
import { IndustryListComponent } from './industry-list/industry-list.component';
import { IndustryRoutingModule } from './industry-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    IndustryRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    AngularEditorModule,
    MatCardModule,
    IndustryDetailComponent,
    IndustryListComponent,
  ],
})
export class IndustryModule {}
