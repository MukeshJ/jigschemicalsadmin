import { Pipe, PipeTransform } from '@angular/core';
import { ContactRequestType } from '@core/domain-classes/contact-request-type-enum';

@Pipe({
  standalone: false,
  name: 'contactRequestType',
})
export class ContactRequestTypePipe implements PipeTransform {

  transform(value: ContactRequestType | number | null | undefined): string {
    switch (value) {
      case ContactRequestType.ContactUs:
        return 'Contact Us';

      case ContactRequestType.Careers:
        return 'Careers';

      default:
        return '';
    }
  }
}
