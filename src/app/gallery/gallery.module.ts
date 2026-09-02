import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryRoutingModule } from './gallery-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryCategoryPipe } from '@shared/pipes/gallery-category.pipe';

@NgModule({
  declarations: [GalleryDetailComponent, GalleryListComponent, GalleryCategoryPipe],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GalleryRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatSortModule
  ]
})
export class GalleryModule { }
