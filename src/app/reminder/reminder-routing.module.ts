import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { ReminderDetailResolverService } from './add-reminder/reminder-detail.resolver';

const routes: Routes = [
  {
    path: '',
    component: ReminderListComponent,
  }, {
    path: 'add',
    component: AddReminderComponent
  }, {
    path: 'manage/:id',
    resolve: { reminder: ReminderDetailResolverService },
    component: AddReminderComponent
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ], exports: [RouterModule]
})
export class ReminderRoutingModule { }
