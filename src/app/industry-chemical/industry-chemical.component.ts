import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { CommonDialogService } from '@core/common-dialog/common-dialog.service';
import { Chemical } from '@core/domain-classes/chemical';
import { Industry } from '@core/domain-classes/industry';
import { IndustryChemicals } from '@core/domain-classes/industry-chemicals';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { BaseComponent } from '../base.component';
import { ChemicalService } from '../chemical/chemical.service';
import { IndustryService } from '../industry/industry.service';
import { IndustryChemicalService } from './industry-chemical.service';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatCard } from '@angular/material/card';
import { MatLabel, MatSelect, MatOption } from '@angular/material/select';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { MatChipSet, MatChip } from '@angular/material/chips';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-industry-chemical',
  templateUrl: './industry-chemical.component.html',
  styleUrls: ['./industry-chemical.component.scss'],
  imports: [
    NgIf,
    MatProgressSpinner,
    MatCard,
    MatLabel,
    MatSelect,
    FormsModule,
    NgFor,
    MatOption,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatChipSet,
    MatChip,
    MatTable,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatCellDef,
    MatCell,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class IndustryChemicalComponent extends BaseComponent implements OnInit {
  industryChemicalForm: UntypedFormGroup;
  selectedIndustry: Industry;
  isLoading = false;
  skip = 0;
  pageSize = 10;
  displayedColumns = ['action', 'name', 'casNumber'];
  footerToDisplayed = ['footer'];
  industryChemicals: Chemical[] = [];
  totalChemicals = 0;
  @ViewChild('paginator') paginator: MatPaginator;
  chemicals$: Observable<Chemical[]>;
  industries: Industry[] = [];

  constructor(
    private fb: UntypedFormBuilder,
    private chemicalService: ChemicalService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
    private industryChemicalService: IndustryChemicalService,
    private industryService: IndustryService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createIndustryChemicalForm();
    this.getIndustries();
    this.chemicals$ = this.industryChemicalForm.get('chemicalNameInput').valueChanges.pipe(
      debounceTime(1000),
      tap(() => (this.isLoading = true)),
      switchMap((value) =>
        this.chemicalService.getChemicalsForDropDown('all', value).pipe(
          tap(() => {
            this.isLoading = false;
          }),
        ),
      ),
      finalize(() => {
        this.isLoading = false;
      }),
    );
  }

  get industryChemicalsArray(): UntypedFormArray {
    return <UntypedFormArray>this.industryChemicalForm.get('industryChemicals');
  }

  getIndustries() {
    this.sub$.sink = this.industryService.getIndustries().subscribe((data) => {
      this.industries = data;
    });
  }

  createIndustryChemicalForm() {
    this.industryChemicalForm = this.fb.group({
      chemicalNameInput: ['', [Validators.required]],
      industryChemicals: this.fb.array([]),
    });
  }

  addChemicalToIndustry(chemical: Chemical): UntypedFormGroup {
    return this.fb.group({
      id: [chemical.id],
      name: [chemical.name],
      casNumber: [chemical.casNumber],
    });
  }

  selectChemical = (chemical: Chemical) => {
    this.industryChemicalsArray.push(this.addChemicalToIndustry(chemical));
    this.industryChemicalForm.get('chemicalNameInput').setValue(null);
  };

  selectIndustry = () => {
    this.getChemicalsList();
  };

  removeChemical(index: number) {
    this.industryChemicalsArray.removeAt(index);
  }

  public pageChange(event: PageEvent): void {
    this.skip = event.pageIndex * event.pageSize;
    this.getChemicalsList();
  }

  getChemicalsList() {
    const industryId = this.selectedIndustry.id;
    this.isLoading = true;
    this.sub$.sink = this.industryChemicalService
      .getChemicalsByIndustryId(industryId, this.skip, this.pageSize, '', '')
      .subscribe(
        (c) => {
          this.industryChemicals = c.chemicals;
          this.totalChemicals = c.totalCount;
          this.isLoading = false;
        },
        () => {
          this.isLoading = false;
        },
      );
  }

  saveIndustryChemicals() {
    if (!this.selectedIndustry) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_INDUSTRY'));
      return;
    }
    var chemicalIdList = (this.industryChemicalsArray.value as Chemical[]).map((c) => c.id);
    if (chemicalIdList.length == 0) {
      this.toastrService.error(
        this.translationService.getValue('PLEASE_SELECT_ATLEASE_ONE_CHEMICAL'),
      );
      return;
    }

    this.isLoading = true;
    var industryChemicals: IndustryChemicals = {
      industryId: this.selectedIndustry.id,
      chemicalIdList,
    };

    this.industryChemicalService.addChemicalIndustry(industryChemicals).subscribe(
      () => {
        this.toastrService.success(
          this.translationService.getValue('INDUSTRY_CHEMICAL_SAVED_SUCCESSFULLY'),
        );
        while (this.industryChemicalsArray.length !== 0) {
          this.industryChemicalsArray.removeAt(0);
        }
        this.isLoading = false;
        this.getChemicalsList();
      },
      () => {
        this.isLoading = false;
      },
    );
  }

  removeChemicalFromIndustry(chemical: Chemical) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(
        `${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ?`,
      )
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.industryChemicalService
            .deleteIndustryChemcial(chemical.id, this.selectedIndustry.id)
            .subscribe(() => {
              this.toastrService.success(
                this.translationService.getValue('CHEMICAL_REMOVED_SUCCESSFULLY'),
              );
              this.getChemicalsList();
            });
        }
      });
  }
}
