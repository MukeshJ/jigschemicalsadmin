import { Component, OnInit, ViewChild } from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
  UntypedFormArray,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { BaseComponent } from 'src/app/base.component';
import { SupplierService } from '../supplier.service';
import { CommonService } from '@core/services/common.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Supplier } from '@core/domain-classes/supplier';
import { Country } from '@core/domain-classes/country';
import { City } from '@core/domain-classes/city';
import { SupplierEmail } from '@core/domain-classes/supplierEmail';
import { ToastrService } from 'ngx-toastr';
import { Guid } from 'guid-typescript';
import { environment } from '@environments/environment';
import { TranslationService } from '@core/services/translation.service';
import { EditorConfig } from '@shared/editor.config';
import { Location } from '@angular/common';

export class AlreadyExistValidator {
  static exist(flag: boolean): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      if (flag) {
        return { exist: true };
      }
      return null;
    };
  }
}

@Component({
  standalone: false,
  selector: 'app-supplier-detail',
  templateUrl: './supplier-detail.component.html',
  styleUrls: ['./supplier-detail.component.scss'],
})
export class SupplierDetailComponent extends BaseComponent implements OnInit {
  supplierForm: UntypedFormGroup;
  titlePage: string = 'Add Supplier';
  imgSrc: any = null;
  isImageUpload: boolean = false;
  supplier: Supplier;
  countries: Country[] = [];
  cities: City[] = [];
  isLoadingCity: boolean = false;
  editorConfig = EditorConfig;
  isLoading = false;

  public filterCityObservable$: Subject<string> = new Subject<string>();

  get supplierAddress(): UntypedFormArray {
    return <UntypedFormArray>this.supplierForm.get('supplierAddresses');
  }
  get supplierEmailsArray(): UntypedFormArray {
    return <UntypedFormArray>this.supplierForm.get('supplierEmails');
  }

  constructor(
    private fb: UntypedFormBuilder,
    private supplierService: SupplierService,
    private commonService: CommonService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.createSupplierForm();
    this.getCountry();
    this.getCityByName();
    const routeSub$ = this.route.data.subscribe(
      (data: { supplier: Supplier }) => {
        if (data.supplier) {
          this.supplier = { ...data.supplier };
          this.titlePage = 'Update Supplier';
          this.patchSupplier();
          if (this.supplier.imageUrl) {
            this.imgSrc = `${environment.apiUrl}${this.supplier.imageUrl}`;
          }
          this.pushValuesSupplierEmailArray();
        } else {
          this.titlePage = 'Add Supplier';
          if (this.supplier) {
            this.imgSrc = '';
            this.supplier = Object.assign({}, null);
          }
          this.addSupplierAddress();
          this.supplierEmailsArray.push(this.buildSupplierEmail());
        }
      }
    );
    this.sub$.add(routeSub$);
  }

  getCityByName() {
    this.isLoadingCity = true;
    this.sub$.sink = this.filterCityObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((c: string) => {
          var strArray = c.split(':');
          return this.commonService.getCityByName(strArray[0], strArray[1]);
        })
      )
      .subscribe(
        (c: City[]) => {
          this.cities = [...c];
          this.isLoadingCity = false;
        },
        (err) => (this.isLoadingCity = false)
      );
  }

  patchSupplier() {
    this.supplierForm.patchValue({
      supplierName: this.supplier.supplierName,
      contactPerson: this.supplier.contactPerson,
      mobileNo: this.supplier.mobileNo,
      phoneNo: this.supplier.phoneNo,
      description: this.supplier.description,
      website: this.supplier.website,
      isVarified: this.supplier.isVarified,
      url: this.supplier.url,
      supplierProfiler: this.supplier.supplierProfile,
    });
    this.addSupplierAddress();
  }

  createSupplierForm() {
    this.supplierForm = this.fb.group({
      supplierName: ['', [Validators.required, Validators.maxLength(500)]],
      contactPerson: [''],
      mobileNo: [''],
      phoneNo: '',
      website: [''],
      description: [''],
      supplierAddresses: this.fb.array([]),
      supplierEmails: this.fb.array([])
    });
  }

  addSupplierAddress(): void {
    this.supplierAddress.push(this.buildSupplierAddress());
  }

  onEmailChange(event: any, index: number) {
    const email = this.supplierEmailsArray.at(index).get('email').value;
    if (!email) {
      return;
    }
    const supplierId =
      this.supplier && this.supplier.id ? this.supplier.id : Guid.create();
    this.sub$.sink = this.supplierService
      .checkEmailOrPhoneExist(email, '', supplierId)
      .subscribe((c) => {
        const emailControl = this.supplierEmailsArray.at(index).get('email');
        if (c) {
          emailControl.setValidators([
            Validators.required,
            Validators.email,
            AlreadyExistValidator.exist(true),
          ]);
        } else {
          emailControl.setValidators([Validators.required, Validators.email]);
        }
        emailControl.updateValueAndValidity();
      });
  }

  onMobileNoChange(event: any) {
    const mobileno = this.supplierForm.get('mobileNo').value;
    if (!mobileno) {
      return;
    }
    const supplierId =
      this.supplier && this.supplier.id ? this.supplier.id : Guid.create();
    this.sub$.sink = this.supplierService
      .checkEmailOrPhoneExist('', mobileno, supplierId)
      .subscribe((c) => {
        const mobileNoControl = this.supplierForm.get('mobileNo');
        if (c) {
          mobileNoControl.setValidators([
            Validators.required,
            AlreadyExistValidator.exist(true),
          ]);
        } else {
          mobileNoControl.setValidators([Validators.required]);
        }
        mobileNoControl.updateValueAndValidity();
      });
  }

  buildSupplierAddress(): UntypedFormGroup {
    if (this.supplier && this.supplier.supplierAddresses && this.supplier.supplierAddresses.length > 0) {
      const supplierAddress = this.supplier.supplierAddresses[0];
      if (supplierAddress.countryName) {
        const strCountryCity =
          supplierAddress.countryName + ':' + supplierAddress.cityName;
        this.filterCityObservable$.next(strCountryCity);
      }
      return this.fb.group({
        id: [supplierAddress.id],
        address: [supplierAddress.address, [Validators.required]],
        countryName: [supplierAddress.countryName, [Validators.required]],
        cityName: [supplierAddress.cityName, [Validators.required]],
      });
    } else {
      return this.fb.group({
        id: [null],
        address: ['', [Validators.required]],
        countryName: ['', [Validators.required]],
        cityName: ['', [Validators.required]],
      });
    }
  }

  buildSupplierEmail(): UntypedFormGroup {
    return this.fb.group({
      id: [''],
      supplierId: [''],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  editSupplierEmail(supplierEmail: SupplierEmail): UntypedFormGroup {
    return this.fb.group({
      id: [supplierEmail.id],
      supplierId: [supplierEmail.supplierId],
      email: [supplierEmail.email, [Validators.email]]
    });
  }

  pushValuesSupplierEmailArray() {
    if (this.supplier.supplierEmails && this.supplier.supplierEmails.length > 0) {
      this.supplier.supplierEmails.map(supplierEmail => {
        this.supplierEmailsArray.push(this.editSupplierEmail(supplierEmail));
      })
    } else {
      const supplierEmail: SupplierEmail = {
        id: '',
        supplierId: this.supplier.id,
        email: ''
      }
      this.supplierEmailsArray.push(this.editSupplierEmail(supplierEmail));
    }
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
      this.isImageUpload = true;
      $event.target.value = '';
    }
  }

  onRemoveImage() {
    this.isImageUpload = true;
    this.imgSrc = '';
  }

  getCountry() {
    const CountrySub$ = this.commonService.getCountry().subscribe((data) => {
      this.countries = data;
    });
    this.sub$.add(CountrySub$);
  }

  handleFilterCity(cityName: string, index: number) {
    cityName = this.supplierAddress.at(index).get('cityName').value
    const country = this.supplierAddress.at(index).get('countryName').value;
    if (cityName && country) {
      const strCountryCity = country + ':' + cityName;
      this.filterCityObservable$.next(strCountryCity);
    }
  }

  onCountryChange(country, index: number) {
    this.supplierAddress.at(index).patchValue({
      cityName: '',
    });
    if (country.value) {
      const strCountry = country.value + ':' + '';
      this.filterCityObservable$.next(strCountry);
    } else {
      this.cities = [];
    }
  }

  onSupplierList() {
    this.location.back();
  }

  onSupplierSubmit() {
    if (this.supplierForm.valid) {
      const supObj = this.createBuildForm();
      supObj.logo = this.imgSrc;
      supObj.isImageUpload = this.isImageUpload;
      if (this.supplier) {
        this.isLoading = true;
        this.sub$.sink = this.supplierService
          .updateSupplier(this.supplier.id, supObj)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('SUPPLIER_UPDATE_SUCCESSFULLY'));
            this.router.navigate(['/supplier']);
          }, () => this.isLoading = false);
      } else {
        this.isLoading = true;
        this.sub$.sink = this.supplierService
          .saveSupplier(supObj)
          .subscribe((c) => {
            this.isLoading = false;
            this.toastrService.success(this.translationService.getValue('SUPPLIER_SAVE_SUCCESSFULLY'));
            this.router.navigate(['/supplier']);
          }, () => this.isLoading = false);
      }
    } else {
      this.markFormGroupTouched(this.supplierForm);
    }
  }

  private markFormGroupTouched(formGroup: UntypedFormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createBuildForm(): Supplier {
    const supplierAddress = this.supplierAddress.value;
    const supplierEmails = this.supplierEmailsArray.value;
    const supplierObj: Supplier = {
      id: this.supplier ? this.supplier.id : null,
      supplierName: this.supplierForm.get('supplierName').value,
      contactPerson: this.supplierForm.get('contactPerson').value,
      mobileNo: this.supplierForm.get('mobileNo').value,
      phoneNo: this.supplierForm.get('phoneNo').value,
      website: this.supplierForm.get('website').value,
      description: this.supplierForm.get('description').value,
      url: '',
      isVarified: true,
      isUnsubscribe: false,
      supplierProfile: '',
      supplierAddresses: [...supplierAddress],
      supplierEmails: [...supplierEmails]
    };
    return supplierObj;
  }

  onAddAnotherEmail() {
    const supplierEmail: SupplierEmail = {
      id: '',
      supplierId: this.supplier && this.supplier.id ? this.supplier.id : '',
      email: ''
    }
    this.supplierEmailsArray.insert(0, this.editSupplierEmail(supplierEmail));
  }

  onDeleteEmail(index: number) {
    this.supplierEmailsArray.removeAt(index);
  }
}
