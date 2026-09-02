import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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

@Component({
  standalone: false,
  selector: 'app-industry-chemical',
  templateUrl: './industry-chemical.component.html',
  styleUrls: ['./industry-chemical.component.scss']
})

export class IndustryChemicalComponent extends BaseComponent implements OnInit {
  industryChemicalForm: FormGroup;
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

  constructor(private fb: FormBuilder,
    private chemicalService: ChemicalService,
    private toastrService: ToastrService,
    private commonDialogService: CommonDialogService,
    private translationService: TranslationService,
    private industryChemicalService: IndustryChemicalService,
    private industryService: IndustryService) {
    super();
  }

  ngOnInit(): void {
    this.createIndustryChemicalForm();
    this.getIndustries();
    this.chemicals$ = this.industryChemicalForm
      .get('chemicalNameInput')
      .valueChanges.pipe(
        debounceTime(1000),
        tap(() => this.isLoading = true),
        switchMap(value =>
          this.chemicalService.getChemicalsForDropDown('all', value)
            .pipe(tap(() => { this.isLoading = false }))
        ),
        finalize(() => { this.isLoading = false })
      );
  }

  get industryChemicalsArray(): FormArray {
    return <FormArray>this.industryChemicalForm.get('industryChemicals');
  }

  getIndustries() {
    this.sub$.sink = this.industryService.getIndustries().subscribe(data => {
      this.industries = data;
    })
  }

  createIndustryChemicalForm() {
    this.industryChemicalForm = this.fb.group({
      chemicalNameInput: ['', [Validators.required]],
      industryChemicals: this.fb.array([]),
    });
  }

  addChemicalToIndustry(chemical: Chemical): FormGroup {
    return this.fb.group({
      id: [chemical.id],
      name: [chemical.name],
      casNumber: [chemical.casNumber]
    });
  }

  selectChemical = (chemical: Chemical) => {
    this.industryChemicalsArray.push(this.addChemicalToIndustry(chemical));
    this.industryChemicalForm.get('chemicalNameInput').setValue(null);
  };

  selectIndustry = () => {
    this.getChemicalsList();
  }

  removeChemical(index: number) {
    this.industryChemicalsArray.removeAt(index)
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
      .subscribe((c) => {
        this.industryChemicals = c.chemicals;
        this.totalChemicals = c.totalCount;
        this.isLoading = false;
      }, () => {
        this.isLoading = false;
      });
  }

  saveIndustryChemicals() {
    if (!this.selectedIndustry) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_INDUSTRY'))
      return;
    }
    var chemicalIdList = (this.industryChemicalsArray.value as Chemical[]).map(c => c.id);
    if (chemicalIdList.length == 0) {
      this.toastrService.error(this.translationService.getValue('PLEASE_SELECT_ATLEASE_ONE_CHEMICAL'))
      return;
    }

    this.isLoading = true;
    var industryChemicals: IndustryChemicals = {
      industryId: this.selectedIndustry.id,
      chemicalIdList
    };

    this.industryChemicalService.addChemicalIndustry(industryChemicals).subscribe(() => {
      this.toastrService.success(this.translationService.getValue('INDUSTRY_CHEMICAL_SAVED_SUCCESSFULLY'));
      while (this.industryChemicalsArray.length !== 0) {
        this.industryChemicalsArray.removeAt(0)
      }
      this.isLoading = false;
      this.getChemicalsList();
    }, () => {
      this.isLoading = false;
    });
  }

  removeChemicalFromIndustry(chemical: Chemical) {
    this.sub$.sink = this.commonDialogService
      .deleteConformationDialog(`${this.translationService.getValue('ARE_YOU_SURE_YOU_WANT_TO_DELETE')} ?`)
      .subscribe((isTrue: boolean) => {
        if (isTrue) {
          this.sub$.sink = this.industryChemicalService.deleteIndustryChemcial(chemical.id, this.selectedIndustry.id)
            .subscribe(() => {
              this.toastrService.success(this.translationService.getValue('CHEMICAL_REMOVED_SUCCESSFULLY'));
              this.getChemicalsList();
            })
        }
      });
  }
}

