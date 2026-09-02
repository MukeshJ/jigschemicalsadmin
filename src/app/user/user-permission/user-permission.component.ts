import { Component, OnInit } from '@angular/core';
import { Action } from '@core/domain-classes/action';
import { PageAction } from '@core/domain-classes/page-action';
import { Page } from '@core/domain-classes/page';
import { ActionService } from '@core/services/action.service';
import { PageActionService } from '@core/services/page-action.service';
import { PageService } from '@core/services/page.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '@core/domain-classes/user';
import { UserService } from '../user.service';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-user-permission',
  templateUrl: './user-permission.component.html',
  styleUrls: ['./user-permission.component.scss']
})
export class UserPermissionComponent extends BaseComponent implements OnInit {

  pageActions$: Observable<PageAction[]>
  pages$: Observable<Page[]>;
  actions$: Observable<Action[]>;
  loading$: Observable<boolean>;
  loadingPage$: Observable<boolean>;
  loadingAction$: Observable<boolean>;
  user: User;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private pageService: PageService,
    private actionService: ActionService,
    private pageActionService: PageActionService,
    private userService: UserService,
    private translationService: TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { user: User }) => {
        this.user = data.user;
      });

    this.loadingAction$ = this.actionService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getActions();
          }
        })
      )
    this.actions$ = this.actionService.entities$

    this.loadingPage$ = this.pageService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getPages();
          }
        })
      )
    this.pages$ = this.pageService.entities$
    this.loading$ = this.pageActionService.loaded$
    this.pageActions$ = this.pageActionService.entities$
    this.getPageActions();

  }

  getActions(): void {
    this.actionService.getAll();
  }

  getPages(): void {
    this.pageService.getAll();
  }

  getPageActions(): void {
    this.pageActionService.getAll();
  }

  manageUserClaimAction(user: User): void {
    this.sub$.sink = this.userService.updateUserClaim(user.userClaims, user.id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('USER_PERMISSION_UPDATED_SUCCESSFULLY'));
      this.router.navigate(['/users']);
    })
  }
}
