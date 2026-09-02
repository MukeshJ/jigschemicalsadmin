import { Component, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Page } from '@core/domain-classes/page';
import { PageService } from '@core/services/page.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-manage-page',
  templateUrl: './manage-page.component.html',
  styleUrls: ['./manage-page.component.scss']
})
export class ManagePageComponent extends BaseComponent implements OnChanges {

  isEdit: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ManagePageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Page,
    private pageService: PageService,
    private toastrServoce: ToastrService,
    private translationService: TranslationService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] != null) {
      if (this.data.id) {
        this.isEdit = true;
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  savePage(): void {
    if (this.data.id) {
      this.pageService.update(this.data).subscribe(d => {
        this.toastrServoce.success(this.translationService.getValue('PAGE_UPDATED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    } else {
      this.pageService.add(this.data).subscribe(() => {
        this.toastrServoce.success(this.translationService.getValue('PAGE_ADDED_SUCCESSFULLY'));
        this.dialogRef.close();
      });
    }
  }
}
