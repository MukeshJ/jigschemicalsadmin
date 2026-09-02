import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { PageAction } from '@core/domain-classes/page-action';
import { Page } from '@core/domain-classes/page';
import { Action } from '@core/domain-classes/action';
import { Observable } from 'rxjs';
import { PageService } from '@core/services/page.service';
import { ActionService } from '@core/services/action.service';
import { PageActionService } from '@core/services/page-action.service';

@Component({
  selector: 'app-manage-page-action',
  templateUrl: './manage-page-action.component.html',
  styleUrls: ['./manage-page-action.component.scss']
})
export class ManagePageActionComponent implements OnInit {
  pageActions$: Observable<PageAction[]>
  pages$: Observable<Page[]>;
  actions$: Observable<Action[]>;
  loading$: Observable<boolean>;
  loadingPage$: Observable<boolean>;
  loadingAction$: Observable<boolean>;

  constructor(
    private pageService: PageService,
    private actionService: ActionService,
    private pageActionService: PageActionService) {

  }

  ngOnInit(): void {

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
    this.pageActions$ = this.pageActionService.entities$;
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

  onAddPageAction(pageAction: PageAction): void {

    this.pageActionService.add(pageAction);
    // TODO: save page action
  }

  onDeletePageAction(pageAction: PageAction) {
    this.pageActionService.delete(pageAction.id);
  }

}
