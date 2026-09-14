import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BaseComponent } from 'src/app/base.component';
import { CommonService } from '@core/services/common.service';
import { Industry } from '@core/domain-classes/industry';
import { FileInfo } from '@core/domain-classes/file-info';
import { Chemical } from '@core/domain-classes/chemical';
import { EntityState } from '@core/domain-classes/entity-state';
import { ChemicalType } from '@core/domain-classes/chemical-type';
import { ChemicalTypeService } from 'src/app/chemical-type/chemical-type.service';
import { environment } from '@environments/environment';
import { UnitService } from '@core/services/unit.service';
import { Unit } from '@core/domain-classes/unit';
import { MatSelect, MatOption, MatLabel } from '@angular/material/select';
import { MatCard, MatCardActions } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';
import { ChemicalLocalStore } from '../chemical-store';
import { Subject } from 'rxjs';
import { Supplier } from 'src/app/core/domain-classes/supplier';
import { ChemicalSuppliersComponent } from 'src/app/chemical-supplier/chemical-suppliers/chemical-suppliers.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  templateUrl: './chemical-detail.component.html',
  styleUrls: ['./chemical-detail.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatLabel,
    MatCard,
    MatCardActions,
    TranslatePipe,
  ],
  providers: [ChemicalLocalStore],
})
export class ChemicalDetailComponent extends BaseComponent implements OnInit {
  private readonly chemicalStore = inject(ChemicalLocalStore);
  chemicalForm: UntypedFormGroup;
  chemicalImages: Array<FileInfo>;
  chemical: Chemical;
  imgSrc: any = null;
  chemicalUploadImage: any = null;
  isImageUpdate: boolean = false;
  industries: Industry[] = [];
  units: Unit[] = [];
  skip: number = 0;
  pageSize: number = 10;
  totalSuppliers = 0;
  _nameFilter = '';
  _mobileFilter = '';
  _emailFilter = '';
  _countryFilter: string;
  categories: ChemicalType[] = [];
  public filterObservable$: Subject<string> = new Subject<string>();
  isLoading: boolean = false;
  suppliers: Supplier[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private commonService: CommonService,
    private chemicalTypeService: ChemicalTypeService,
    private unitService: UnitService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.getIndustries();
    this.getChemicalTypes();
    this.getUnits();
    this.createForm();
    this.sub$.sink = this.route.data.subscribe((data: { chemical: Chemical }) => {
      if (data.chemical) {
        this.chemical = { ...data.chemical };
        this.patchChemical();
        if (this.chemical.url) {
          this.imgSrc = environment.apiUrl + this.chemical.url;
        }
      } else {
        if (this.chemical) {
          this.imgSrc = null;
          this.chemical = null;
        }
      }
      this.cdr.detectChanges();
    });
  }

  getChemicalTypes() {
    this.sub$.sink = this.chemicalTypeService.getChemicalTypes().subscribe((c) => {
      this.categories = c;
      if (this.chemical) {
        this.chemicalForm.patchValue({
          chemicalCategories: this.chemical.chemicalCategories
            ? this.chemical.chemicalCategories.map((c) => c.categoryId)
            : [],
        });
      }
      this.cdr.detectChanges();
    });
  }

  getIndustries() {
    this.sub$.sink = this.commonService.getIndustries().subscribe((c) => {
      this.industries = c;
      if (this.chemical) {
        this.chemicalForm.patchValue({
          chemicalIndustries: this.chemical.chemicalIndustries
            ? this.chemical.chemicalIndustries.map((c) => c.industryId)
            : [],
        });
      }
      this.cdr.detectChanges();
    });
  }

  getUnits() {
    this.sub$.sink = this.unitService.getAll().subscribe((units) => {
      this.units = units;
      if (this.chemical) {
        this.chemicalForm.patchValue({ unitId: this.chemical.unitId });
      }
      this.cdr.detectChanges();
    });
  }

  onRemoveImage() {
    this.isImageUpdate = true;
    this.imgSrc = '';
  }

  createForm() {
    this.chemicalForm = this.fb.group({
      name: ['', [Validators.required]],
      casNumber: [''],
      hBondAcceptor: [''],
      hBondDonor: [''],
      iUPACName: '',
      inChIKey: '',
      molecularFormula: '',
      molecularWeight: '',
      synonyms: '',
      chemicalDetailId: '',
      unitId: [''],
      isShowInFront: [false],
      objectState: EntityState.Added,
      chemicalImage: [this.chemicalImages],
      chemicalIndustries: [],
      chemicalCategories: [],
    });
  }

  patchChemical() {
    this.chemicalForm.patchValue({
      name: this.chemical.name,
      casNumber: this.chemical.casNumber,
      hBondAcceptor: this.chemical.hBondAcceptor,
      hBondDonor: this.chemical.hBondDonor,
      iUPACName: this.chemical.iupacName,
      inChIKey: this.chemical.inChIKey,
      molecularFormula: this.chemical.molecularFormulla,
      molecularWeight: this.chemical.molecularWeight,
      synonyms: this.chemical.synonyms,
      chemicalDetailId: this.chemical.chemicalDetailId,
      chemicalImage: [this.chemicalImages],
      chemicalIndustries: this.chemical.chemicalIndustries
        ? this.chemical.chemicalIndustries.map((c) => c.industryId)
        : [],
      chemicalCategories: this.chemical.chemicalCategories
        ? this.chemical.chemicalCategories.map((c) => c.categoryId)
        : [],
      objectState: EntityState.Modified,
      unitId: this.chemical.unitId,
      isShowInFront: this.chemical.isShowInFront,
    });
    this.imgSrc = this.chemical.url;
  }

  onFileSelect($event) {
    const fileSelected = $event.target.files[0];
    if (!fileSelected) {
      return;
    }
    const mimeType = fileSelected.type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(fileSelected);
    // tslint:disable-next-line: variable-name
    reader.onload = (_event) => {
      this.imgSrc = reader.result;
      this.isImageUpdate = true;
      this.chemicalUploadImage = Object.assign(
        {},
        {
          src: reader.result,
          uid: fileSelected.uid,
        },
      );
      $event.target.value = '';
    };
  }

  buildChemicalObj(): Chemical {
    const chemicalObj: Chemical = {
      id: this.chemical ? this.chemical.id : null,
      name: this.chemicalForm.get('name').value,
      casNumber: this.chemicalForm.get('casNumber').value,
      hBondAcceptor: this.chemicalForm.get('hBondAcceptor').value,
      hBondDonor: this.chemicalForm.get('hBondDonor').value,
      iupacName: this.chemicalForm.get('iUPACName').value,
      inChIKey: this.chemicalForm.get('inChIKey').value,
      molecularFormulla: this.chemicalForm.get('molecularFormula').value,
      molecularWeight: this.chemicalForm.get('molecularWeight').value,
      synonyms: this.chemicalForm.get('synonyms').value,
      lstChemicalIndustries: this.chemicalForm.get('chemicalIndustries').value,
      listChemicalCategories: this.chemicalForm.get('chemicalCategories').value,
      chemicalDetailId: this.chemical ? this.chemical.chemicalDetailId : null,
      url: this.chemical && this.chemical.url ? this.chemical.url : '',
      objectState: this.chemical ? EntityState.Modified : EntityState.Added,
      unitId: this.chemicalForm.get('unitId').value,
      isShowInFront: this.chemicalForm.get('isShowInFront').value,
    };
    return chemicalObj;
  }

  onChemicalSave() {
    if (this.chemicalForm.valid) {
      const chemicalObj = this.buildChemicalObj();
      if (this.isImageUpdate) {
        chemicalObj.chemicalImage = this.imgSrc ? this.imgSrc : '';
        chemicalObj.isImageUpdate = true;
      }

      if (chemicalObj.id) {
        this.chemicalStore.updateChemical(chemicalObj);
      } else {
        this.chemicalStore.saveChemical(chemicalObj);
      }
    } else {
      this.chemicalForm.markAllAsTouched();
    }
  }
  onChemicalList() {
    this.router.navigate(['/chemical'], { relativeTo: this.route });
  }
  
    viewSuppliers(chemical: Chemical): void {
      this.dialog.open(ChemicalSuppliersComponent, {
        height: 'auto',
        data: Object.assign({}, chemical),
      });
    }
  
}
