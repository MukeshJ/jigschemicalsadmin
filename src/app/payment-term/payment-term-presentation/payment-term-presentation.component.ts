import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { PaymentTerm } from '@core/domain-classes/payment-term';
import { TranslationService } from '@core/services/translation.service';
import { BaseComponent } from 'src/app/base.component';
import { ManagePaymentTermComponent } from '../manage-payment-term/manage-payment-term.component';

@Component({
  standalone: false,
  selector: 'app-payment-term-presentation',
  templateUrl: './payment-term-presentation.component.html',
  styleUrls: ['./payment-term-presentation.component.scss']
})
export class PaymentTermPresentationComponent extends BaseComponent implements OnInit {

  @Input() paymentTerms: PaymentTerm[];
  @Input() loading: boolean;
  @Output() deletePaymentTermHandler: EventEmitter<string> = new EventEmitter<string>();
  displayedColumns: string[] = ['action', 'name'];

  constructor(
    private dialog: MatDialog,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService
  ) {
    super();
  }

  ngOnInit(): void {

  }

  deletePaymentTerm(paymentTerm: PaymentTerm): void {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ${paymentTerm.name}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.deletePaymentTermHandler.emit(paymentTerm.id);
        }
      });
  }

  managePaymentTerm(paymentTerm: PaymentTerm): void {
    this.dialog.open(ManagePaymentTermComponent, {
      width: '350px',
      data: Object.assign({}, paymentTerm)
    });
  }
}
