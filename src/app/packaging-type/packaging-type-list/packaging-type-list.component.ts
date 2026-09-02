import { Component, OnInit } from '@angular/core';
import { PackagingType } from '@core/domain-classes/packaging-type';
import { PackagingTypeService } from '@core/services/packaging-type.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';

@Component({
  standalone: false,
  selector: 'app-packaging-type-list',
  templateUrl: './packaging-type-list.component.html',
  styleUrls: ['./packaging-type-list.component.scss']
})
export class PackagingTypeListComponent extends BaseComponent implements OnInit {
  packagingTypes$: Observable<PackagingType[]>;
  loading$: Observable<boolean>;
  constructor(
    private packagingTypeService: PackagingTypeService,
    private toastrService: ToastrService,
    private translationService: TranslationService) {
    super();
  }
  ngOnInit(): void {

    this.loading$ = this.packagingTypeService.loaded$
      .pipe(
        tap(loaded => {
          if (!loaded) {
            this.getPackagingTypes();
          }
        })
      )
    this.packagingTypes$ = this.packagingTypeService.entities$
  }

  getPackagingTypes(): void {
    this.packagingTypeService.getAll();
  }

  deletePackagingType(id: string): void {
    this.sub$.sink = this.packagingTypeService.delete(id).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('PACKAGING_TYPE_DELETED_SUCCESSFULLY'));
    });
  }

  // managePackagingType(packagingType: PackagingType): void {
  //   if (packagingType.id) {
  //     this.sub$.sink = this.packagingTypeService.update(packagingType).subscribe(() => {
  //       this.toastrService.success(`Packaging Type Updated Successfully.`);
  //     });
  //   } else {
  //     this.sub$.sink = this.packagingTypeService.add(packagingType).subscribe(() => {
  //       this.toastrService.success(`Packaging Type Saved Successfully.`);
  //     });
  //   }

  // }
}
