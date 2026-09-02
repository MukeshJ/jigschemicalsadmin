import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { TruncatePipe } from './truncate.pipe';
import { DateAgoPipe } from './date-ago.pipe';
import { PaymentStatusPipe } from './purchase-order-paymentStatus.pipe';
import { PaymentMethodPipe } from './paymentMethod.pipe';
import { CustomCurrencyPipe } from './custome-currency.pipe';
import { UTCToLocalTime } from './utc-to-localtime.pipe';
import { ContactRequestTypePipe } from './contact-request-type-pipe';



@NgModule({
    declarations: [
        TruncatePipe,
        DateAgoPipe,
        PaymentStatusPipe,
        PaymentMethodPipe,
        CustomCurrencyPipe,
        UTCToLocalTime,
        ContactRequestTypePipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        TruncatePipe,
        DateAgoPipe,
        PaymentStatusPipe,
        PaymentMethodPipe,
        CustomCurrencyPipe,
        UTCToLocalTime,
        ContactRequestTypePipe
    ],
    providers: [CurrencyPipe]
})
export class PipesModule { }
