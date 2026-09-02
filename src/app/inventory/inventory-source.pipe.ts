import { Pipe, PipeTransform } from '@angular/core';
import { inventorySource } from '@core/domain-classes/inventory/inventory-source';
import { TranslationService } from '@core/services/translation.service';

@Pipe({
  standalone: false,
  name: 'inventorySource'
})

export class InventorySourcePipe implements PipeTransform {

  constructor(public translationService: TranslationService) {

  }
  transform(value: any, ...args: any[]): any {
    const inventoryName = inventorySource.find(c => c.id == value);
    if (inventoryName) {
      return this.translationService.getValue(inventoryName.name);
    }
    return '';
  }
}
