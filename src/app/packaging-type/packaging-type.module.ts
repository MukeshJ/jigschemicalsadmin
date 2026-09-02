import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackagingTypeListComponent } from './packaging-type-list/packaging-type-list.component';
import { PackagingTypeListPresentationComponent } from './packaging-type-list-presentation/packaging-type-list-presentation.component';
import { ManagePackagingTypeComponent } from './manage-packaging-type/manage-packaging-type.component';
import { PackagingTypeRoutingModule } from './packaging-type-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    PackagingTypeRoutingModule,
    ReactiveFormsModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    SharedModule,
    PackagingTypeListComponent,
    PackagingTypeListPresentationComponent,
    ManagePackagingTypeComponent,
  ],
})
export class PackagingTypeModule {}
