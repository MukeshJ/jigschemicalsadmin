import { Component, OnInit } from '@angular/core';
import { UserAuth } from '@core/domain-classes/user-auth';
import { SecurityService } from '@core/security/security.service';
import { CommonService } from '@core/services/common.service';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { RouterLinkActive, RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [HasClaimDirective, RouterLinkActive, RouterLink, NgClass, TranslatePipe],
})
export class SidebarComponent extends BaseComponent implements OnInit {
  appUserAuth: UserAuth = null;
  currentUrl: string = 'dashboard';

  constructor(
    private securityService: SecurityService,
    private commonService: CommonService,
  ) {
    super();
  }

  ngOnInit() {
    this.setTopLogAndName();
    this.routerNavigate();
  }

  setTopLogAndName() {
    this.sub$.sink = this.securityService.securityObject$.subscribe((c) => {
      if (c) {
        this.appUserAuth = c;
        if (this.appUserAuth.profilePhoto) {
          this.appUserAuth.profilePhoto = `${environment.apiUrl}${this.appUserAuth.profilePhoto}`;
        }
      }
    });
  }
  routerNavigate() {
    this.sub$.sink = this.commonService.currentUrl$.subscribe((c) => {
      this.currentUrl = c;
    });
  }

  toggleMenu(menuName: string): void {
    const nextValue = this.currentUrl === menuName ? '' : menuName;
    this.currentUrl = nextValue;
    this.commonService.setCurrentUrl(nextValue);
  }

  getState(currentMenu) {
    if (currentMenu.active) {
      return 'down';
    } else {
      return 'up';
    }
  }
}
