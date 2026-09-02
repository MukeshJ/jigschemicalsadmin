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
import { RoleService } from '../role.service';
import { Role } from '@core/domain-classes/role';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-manage-role',
  templateUrl: './manage-role.component.html',
  styleUrls: ['./manage-role.component.scss']
})
export class ManageRoleComponent extends BaseComponent implements OnInit {
  pageActions$: Observable<PageAction[]>
  pages$: Observable<Page[]>;
  actions$: Observable<Action[]>;
  loading$: Observable<boolean>;
  loadingPage$: Observable<boolean>;
  loadingAction$: Observable<boolean>;
  role: Role;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private pageService: PageService,
    private actionService: ActionService,
    private pageActionService: PageActionService,
    private roleService: RoleService,
    private translationService: TranslationService) {
    super();
  }

  ngOnInit(): void {
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { role: Role }) => {
        if (data.role) {
          this.role = data.role;
        } else {
          this.role = {
            roleClaims: [],
            userRoles: []
          };
        }
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

  manageRole(role: Role): void {
    if (!role.name) {
      this.toastrService.error(this.translationService.getValue('PLEASE_ENTER_ROLE_NAME'));
      return;
    }

    if (role.roleClaims.length == 0) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_AT_LEAT_ONE_PERMISSION'));
      return;
    }

    if (!role.id)
      this.sub$.sink = this.roleService.addRole(role).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ROLE_SAVED_SUCCESSFULLY'));
        this.router.navigate(['/roles']);
      });
    else
      this.sub$.sink = this.roleService.updateRole(role).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ROLE_UPDATED_SUCCESSFULLY'));
        this.router.navigate(['/roles']);
      });
  }
}
