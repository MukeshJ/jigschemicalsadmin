import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagePageActionComponent } from './manage-page-action/manage-page-action.component';
import { PageActionRoutingModule } from './page-action-routing.module';
import { ManagePageActionPresentationComponent } from './manage-page-action-presentation/manage-page-action-presentation.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    ManagePageActionComponent,
    ManagePageActionPresentationComponent],
  imports: [
    CommonModule,
    PageActionRoutingModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class PageActionModule { }
