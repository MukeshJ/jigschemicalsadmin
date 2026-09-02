import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Action } from '@core/domain-classes/action';
import { PageAction } from '@core/domain-classes/page-action';
import { User } from '@core/domain-classes/user';
import { Page } from '@core/domain-classes/page';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  standalone: false,
  selector: 'app-user-permission-presentation',
  templateUrl: './user-permission-presentation.component.html',
  styleUrls: ['./user-permission-presentation.component.scss']
})
export class UserPermissionPresentationComponent implements OnInit {

  @Input() pages: Page[];
  @Input() actions: Action[];
  @Input() pageActions: PageAction[];
  @Input() loading: boolean;
  @Input() loadingPage: boolean;
  @Input() loadingAction: boolean;
  @Input() user: User;
  @Output() manageUserClaimAction: EventEmitter<User> = new EventEmitter<User>();
  step: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  checkPageAction(pageId: string, actionId: string): boolean {
    const pageAction = this.pageActions.find(c => c.pageId === pageId && c.actionId === actionId);
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  checkPermission(pageId: string, actionId: string): boolean {
    const pageAction = this.user.userClaims.find(c => c.pageId === pageId && c.actionId === actionId);
    if (pageAction) {
      return true;
    } else {
      return false;
    }
  }

  onPermissionChange(flag: MatSlideToggleChange, page: Page, action: Action) {
    if (flag.checked) {
      this.user.userClaims.push({
        userId: this.user.id,
        claimType: `${page.name}_${action.name}`,
        claimValue: '',
        pageId: page.id,
        actionId: action.id
      })
    } else {
      const roleClaimToRemove = this.user.userClaims.find(c => c.actionId === action.id && c.pageId === page.id);
      const index = this.user.userClaims.indexOf(roleClaimToRemove, 0);
      if (index > -1) {
        this.user.userClaims.splice(index, 1);
      }
    }
  }

  onPageSelect(event: MatCheckboxChange, pageName: string) {
    if (event.checked) {
      this.pages.filter(c => c.name == pageName).forEach(page => {
        this.actions.forEach(action => {
          if (this.checkPageAction(page.id, action.id)) {
            this.user.userClaims.push({
              userId: this.user.id,
              claimType: `${page.name}_${action.name}`,
              claimValue: '',
              pageId: page.id,
              actionId: action.id
            });
          }
        });
      });
    } else {
      var page = this.pages.find(c => c.name == pageName);
      this.user.userClaims = this.user.userClaims.filter(c => c.pageId != page.id);
    }
  }

  saveUserClaim() {
    this.manageUserClaimAction.emit(this.user);
  }

  selecetAll(event: MatCheckboxChange) {
    if (event.checked) {
      this.pages.forEach(page => {
        this.actions.forEach(action => {
          if (this.checkPageAction(page.id, action.id)) {
            this.user.userClaims.push({
              userId: this.user.id,
              claimType: `${page.name}_${action.name}`,
              claimValue: '',
              pageId: page.id,
              actionId: action.id
            });
          }
        });
      });
    } else {
      this.user.userClaims = [];
    }
  }
}
