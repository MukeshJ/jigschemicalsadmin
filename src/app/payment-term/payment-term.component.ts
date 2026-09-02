import { Component, OnInit } from '@angular/core';
import { PaymentTerm } from '@core/domain-classes/payment-term';
import { PaymentTermService } from '@core/services/payment-term.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { PaymentTermPresentationComponent } from './payment-term-presentation/payment-term-presentation.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-payment-term',
  templateUrl: './payment-term.component.html',
  styleUrls: ['./payment-term.component.scss'],
  imports: [PaymentTermPresentationComponent, AsyncPipe],
})
export class PaymentTermComponent extends BaseComponent implements OnInit {
  paymentTerms$: Observable<PaymentTerm[]>;
  loading$: Observable<boolean>;
  constructor(
    private paymentTermService: PaymentTermService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.loading$ = this.paymentTermService.loaded$.pipe(
      tap((loaded) => {
        if (!loaded) {
          this.getPaymentTerms();
        }
      }),
    );
    this.paymentTerms$ = this.paymentTermService.entities$;
  }

  getPaymentTerms(): void {
    this.paymentTermService.getAll();
  }

  deletePaymentTerm(id: string): void {
    this.sub$.sink = this.paymentTermService.delete(id).subscribe(
      (success: number | string) => {
        this.toastrService.success(
          this.translationService.getValue('PAYMENT_TERM_DELETED_SUCCESSFULLY'),
        );
      },
      (err) => {
        this.paymentTermService.getAll();
      },
    );
  }

  // managePaymentTerm(paymentTerm: PaymentTerm): void {
  //   if (paymentTerm.id) {
  //     this.sub$.sink = this.paymentTermService.update(paymentTerm)
  //       .subscribe(() => {
  //         this.toastrService.success(`Payment Term Updated Successfully.`);
  //       });
  //   } else {
  //     this.sub$.sink = this.paymentTermService.add(paymentTerm)
  //       .subscribe(() => {
  //         this.toastrService.success(`Payment Term Saved Successfully.`);
  //       });
  //   }
  // }
}
