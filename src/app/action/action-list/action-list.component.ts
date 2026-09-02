import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { Action } from '@core/domain-classes/action';
import { ActionService } from '@core/services/action.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent extends BaseComponent implements OnInit {
  actions$: Observable<Action[]>;
  loading$: Observable<boolean>;
  constructor(
    private actionService: ActionService,
    private toastrService: ToastrService) {
    super();
  }
  ngOnInit(): void {

    this.loading$ = this.actionService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getActions();
          }
        })
      )
    this.actions$ = this.actionService.entities$
  }

  getActions(): void {
    this.actionService.getAll();
  }

  deleteAction(id: string): void {
    this.sub$.sink = this.actionService.delete(id).subscribe(() => {
      this.toastrService.success(`Action Deleted Successfully.`);
    });
  }

  manageAction(action: Action): void {
    if (action.id) {
      this.sub$.sink = this.actionService.update(action).subscribe(() => {
        this.toastrService.success(`Action Updated Successfully.`);
      });
    } else {
      this.sub$.sink = this.actionService.add(action).subscribe(() => {
        this.toastrService.success(`Action Saved Successfully.`);
      });
    }

  }
}

