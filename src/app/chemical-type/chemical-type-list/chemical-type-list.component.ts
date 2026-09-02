import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { ChemicalType } from '@core/domain-classes/chemical-type';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalTypeAddComponent } from '../chemical-type-add/chemical-type-add.component';
import { ChemicalTypeService } from '../chemical-type.service';

@Component({
  standalone: false,
  selector: 'app-chemical-type-list',
  templateUrl: './chemical-type-list.component.html',
  styleUrls: ['./chemical-type-list.component.scss']
})
export class ChemicalTypeListComponent extends BaseComponent implements OnInit {

  chemicalTypes$: Observable<ChemicalType[]>;
  displayedColumns: string[] = ['action', 'name', 'isShowFront'];
  constructor(
    private chemicalTypeService: ChemicalTypeService,
    private toastrService: ToastrService,
    private dialog: MatDialog,
    private translationService: TranslationService,
    private commonDialogService: CommonDialogService) {
    super();
  }
  ngOnInit(): void {
    this.getChemicalTypes();
  }

  getChemicalTypes(): void {
    this.chemicalTypes$ = this.chemicalTypeService.getChemicalTypes();
  }

  deleteChemicalType(chemicalType: ChemicalType): void {
    const areU = this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE');
    this.sub$.sink = this.commonDialogService.deleteConformationDialog(`${areU}`)
      .subscribe(isTrue => {
        if (isTrue) {
          this.sub$.sink = this.chemicalTypeService.deleteChemicalType(chemicalType.id)
            .subscribe(() => {
              this.getChemicalTypes();
              this.toastrService.success(this.translationService.getValue('CHEMICAL_TYPE_DELETED_SUCCESSFULLY'));
            });
        }
      });
  }

  manageChemicalType(chemicalType: ChemicalType): void {
    const dialogRef = this.dialog.open(ChemicalTypeAddComponent, {
      width: '80vw',
      data: Object.assign({}, chemicalType)
    });
    this.sub$.sink = dialogRef.afterClosed()
      .subscribe((isUpdated: boolean) => {
        if (isUpdated) {
          this.getChemicalTypes();
        }
      });
  }

}
