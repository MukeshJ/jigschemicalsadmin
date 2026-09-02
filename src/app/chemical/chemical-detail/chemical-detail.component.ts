import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from '../chemical.service';
import { CommonService } from '@core/services/common.service';
import { Industry } from '@core/domain-classes/industry';
import { FileInfo } from '@core/domain-classes/file-info';
import { Chemical } from '@core/domain-classes/chemical';
import { EntityState } from '@core/domain-classes/entity-state';
import { ToastrService } from 'ngx-toastr';
import { ChemicalType } from '@core/domain-classes/chemical-type';
import { ChemicalTypeService } from 'src/app/chemical-type/chemical-type.service';
import { environment } from '@environments/environment';
import { TranslationService } from '@core/services/translation.service';
import { UnitService } from '@core/services/unit.service';
import { Unit } from '@core/domain-classes/unit';


@Component({
  standalone: false,
  templateUrl: './chemical-detail.component.html',
  styleUrls: ['./chemical-detail.component.scss'],
})
export class ChemicalDetailComponent extends BaseComponent implements OnInit {
  chemicalForm: UntypedFormGroup;
  chemicalImages: Array<FileInfo>;
  chemical: Chemical;
  imgSrc: any = null;
  chemicalUploadImage: any = null;
  isImageUpdate: boolean = false;
  industries: Industry[] = [];
  units: Unit[] = [];
  categories: ChemicalType[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private chemicalService: ChemicalService,
    private commonService: CommonService,
    private toastrService: ToastrService,
    private chemicalTypeService: ChemicalTypeService,
    private unitService: UnitService,
    private translationService: TranslationService
  ) {
    super();
  }

  ngOnInit() {
    this.getIndustries();
    this.getChemicalTypes();
    this.getUnits();
    this.createForm();
    this.sub$.sink = this.route.data.subscribe(
      (data: { chemical: Chemical }) => {
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
      }
    );
  }

  getChemicalTypes() {
    this.sub$.sink = this.chemicalTypeService.getChemicalTypes()
      .subscribe(c => {
        this.categories = c;
      });
  }

  getIndustries() {
    this.sub$.sink = this.commonService.getIndustries()
      .subscribe(c => {
        this.industries = c;
      });
  }

  getUnits() {
    this.unitService.getAll().subscribe(units => {
      this.units = units;
    })
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
      chemicalIndustries: this.chemical.chemicalIndustries ? this.chemical.chemicalIndustries.map(c => c.industryId) : [],
      chemicalCategories: this.chemical.chemicalCategories ? this.chemical.chemicalCategories.map(c => c.categoryId) : [],
      objectState: EntityState.Modified,
      unitId: this.chemical.unitId,
      isShowInFront: this.chemical.isShowInFront
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
        }
      );
      $event.target.value = '';
    }
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
      isShowInFront: this.chemicalForm.get('isShowInFront').value
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
        this.sub$.sink = this.chemicalService
          .updateChemical(chemicalObj.id, chemicalObj)
          .subscribe((c) => {
            this.toastrService.success(this.translationService.getValue('CHEMICAL_UPDATED_SUCCESSFULLY'));
            this.router.navigate(['/chemical'], { relativeTo: this.route });
          });
      } else {
        this.sub$.sink = this.chemicalService
          .saveChemical(chemicalObj)
          .subscribe((c) => {
            this.toastrService.success(this.translationService.getValue('CHEMICAL_SAVE_SUCCESSFULLY'));
            this.router.navigate(['/chemical'], { relativeTo: this.route });
          });
      }
    } else {
      this.chemicalForm.markAllAsTouched();
    }
  }
  onChemicalList() {
    this.router.navigate(['/chemical'], { relativeTo: this.route });
  }
}
