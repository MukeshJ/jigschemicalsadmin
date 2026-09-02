import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionRoutingModule } from './session-routing.module';
import { SessionComponent } from './session.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  imports: [CommonModule, SharedModule, SessionRoutingModule, SessionComponent],
})
export class SessionModule {}
