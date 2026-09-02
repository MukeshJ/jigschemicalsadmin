import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';
import { EmailSendComponent } from './email-send.component';

export const routes: Routes = [
  {
    path: '',
    component: EmailSendComponent,
    data: { claimType: 'email_send_email' }
  }
]
