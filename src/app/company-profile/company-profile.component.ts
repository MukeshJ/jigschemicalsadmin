import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { Currency } from '@core/domain-classes/currency';
import { SecurityService } from '@core/security/security.service';
import { CommonService } from '@core/services/common.service';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { CompanyProfileService } from './company-profile.service';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCard, MatCardActions } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.css'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
    MatCard,
    MatCardActions,
    RouterLink,
    TranslatePipe,
  ],
})
export class CompanyProfileComponent implements OnInit {
  companyProfileForm: UntypedFormGroup;
  imgSrc: string | ArrayBuffer = '';
  isLoading = false;
  currencies: Currency[] = [];
  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private companyProfileService: CompanyProfileService,
    private router: Router,
    private toastrService: ToastrService,
    private securityService: SecurityService,
    private commonService: CommonService,
    private translationService: TranslationService,
  ) {}

  ngOnInit(): void {
    this.createform();
    this.getCurrencies();
    this.route.data.subscribe((data: { profile: CompanyProfile }) => {
      this.companyProfileForm.patchValue(data.profile);
      if (data.profile.logoUrl) {
        this.imgSrc = environment.apiUrl + data.profile.logoUrl;
      }
    });
  }

  createform() {
    this.companyProfileForm = this.fb.group({
      id: [''],
      title: ['', [Validators.required]],
      address: ['', [Validators.required]],
      logoUrl: [''],
      imageData: [],
      phone: [''],
      email: ['', [Validators.email]],
      currencyCode: ['', [Validators.required]],
    });
  }

  getCurrencies() {
    this.commonService.getCurrencies().subscribe((data) => (this.currencies = data));
  }

  saveCompanyProfile() {
    if (this.companyProfileForm.invalid) {
      this.companyProfileForm.markAllAsTouched();
      return;
    }
    const companyProfile: CompanyProfile = this.companyProfileForm.getRawValue();
    this.isLoading = true;
    this.companyProfileService.updateCompanyProfile(companyProfile).subscribe(
      (companyProfile: CompanyProfile) => {
        this.isLoading = false;
        this.securityService.updateProfile(companyProfile);
        this.toastrService.success(
          this.translationService.getValue('COMPANY_PROFILE_UPDATED_SUCCESSFULLY'),
        );
        this.router.navigate(['dashboard']);
      },
      () => (this.isLoading = false),
    );
  }

  onFileSelect($event) {
    const fileSelected: File = $event.target.files[0];
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
      this.companyProfileForm.patchValue({
        imageData: reader.result.toString(),
        logoUrl: fileSelected.name,
      });
      $event.target.value = '';
    };
  }
}
