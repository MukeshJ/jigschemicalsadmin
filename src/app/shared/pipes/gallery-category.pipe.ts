import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';
import { GalleryCategoryEnum } from 'src/app/gallery/categories-enum';

@Pipe({
  standalone: false,
  name: 'galleryCategory'
})

export class GalleryCategoryPipe implements PipeTransform {
  constructor(private translationService: TranslationService) { }

  transform(value: GalleryCategoryEnum | string): string {
    if (value == null) {
      return '';
    }

    switch (value) {
      case GalleryCategoryEnum.Journey:
        return this.translationService.getValue('JOURNEY');

      case GalleryCategoryEnum.People:
        return this.translationService.getValue('PEOPLE');

      case GalleryCategoryEnum.Products:
        return this.translationService.getValue('PRODUCTS');

      case GalleryCategoryEnum.Presence:
        return this.translationService.getValue('PRESENCE');

      default:
        return '';
    }
  }
}
