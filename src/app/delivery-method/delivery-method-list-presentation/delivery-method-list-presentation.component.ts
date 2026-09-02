import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { DeliveryMethod } from '@core/domain-classes/delivery-method';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManageDeliveryMethodComponent } from '../manage-delivery-method/manage-delivery-method.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-delivery-method-list-presentation',
  templateUrl: './delivery-method-list-presentation.component.html',
  styleUrls: ['./delivery-method-list-presentation.component.scss'],
  imports: [
    MatProgressSpinner,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    TranslatePipe,
  ],
})
export class DeliveryMethodListPresentationComponent extends BaseComponent implements OnInit {
  @Input() deliveryMethods: DeliveryMethod[];
  @Input() loading: boolean = false;
  @Output() deleteDeliveryMethodHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];
  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
  ) {
    super();
  }

  ngOnInit(): void {}

  deleteDeliveryMethod(deliveryMethod: DeliveryMethod): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${areU} :: ${deliveryMethod.name}`)
      .subscribe((isTrue) => {
        if (isTrue) {
          this.deleteDeliveryMethodHandler.emit(deliveryMethod.id);
        }
      });
  }

  manageDeliveryMethod(deliveryMethod: DeliveryMethod): void {
    this.dialog.open(ManageDeliveryMethodComponent, {
      width: '350px',
      data: Object.assign({}, deliveryMethod),
    });
  }
}
