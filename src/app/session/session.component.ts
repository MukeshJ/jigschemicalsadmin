import { Component, OnInit } from '@angular/core';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { OnlineUser } from '@core/domain-classes/online-user';
import { SignalrService } from '@core/services/signalr.service';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from '../base.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss'],
  imports: [TranslatePipe],
})
export class SessionComponent extends BaseComponent implements OnInit {
  onlineUsers: OnlineUser[] = [];

  constructor(
    private signalrService: SignalrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getOnlineUsers();
  }
  getOnlineUsers() {
    this.sub$.sink = this.signalrService.onlineUsers$.subscribe((c) => {
      this.onlineUsers = c;
    });
  }
  onForceLogout(id: string) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_FORCE_LOGOUT_USER'),
      )
      .subscribe((flag: boolean) => {
        if (flag) {
          this.signalrService.forceLogout(id);
        }
      });
  }
}
