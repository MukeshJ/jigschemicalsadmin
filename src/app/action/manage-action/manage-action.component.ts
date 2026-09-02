import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from 'src/app/base.component';
import { Action } from '@core/domain-classes/action';
import { ActionService } from '@core/services/action.service';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '@core/services/translation.service';

@Component({
  selector: 'app-manage-action',
  templateUrl: './manage-action.component.html',
  styleUrls: ['./manage-action.component.scss']
})
export class ManageActionComponent extends BaseComponent implements OnChanges {
  isEdit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ManageActionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Action,
    private actionService: ActionService,
    private toastrService: ToastrService,
    private translationService: TranslationService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      if (this.data.id) {
        this.isEdit = true;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveAction(): void {
    if (this.data.id) {
      this.actionService.update(this.data).subscribe(() => {
        this.toastrService.success( this.translationService.getValue('ACTION_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.actionService.add(this.data).subscribe(() => {
        this.toastrService.success(this.translationService.getValue('ACTION_SAVED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }

}
