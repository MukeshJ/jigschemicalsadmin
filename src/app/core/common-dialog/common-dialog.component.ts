import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-common-dialog',
  templateUrl: './common-dialog.component.html',
  styleUrls: ['./common-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [TranslatePipe],
})
export class CommonDialogComponent {
  primaryMessage: string;
  constructor(public dialogRef: MatDialogRef<CommonDialogComponent>) {}

  clickHandler(data): void {
    this.dialogRef.close(data);
  }
}
