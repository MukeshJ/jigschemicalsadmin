import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Industry } from '@core/domain-classes/industry';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { EditorConfig } from '@shared/editor.config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { IndustryService } from '../industry.service';

@Component({
  selector: 'app-industry-detail',
  templateUrl: './industry-detail.component.html',
  styleUrls: ['./industry-detail.component.scss']
})
export class IndustryDetailComponent extends BaseComponent implements OnInit {
  isEditMode = false;
  industryForm: FormGroup;
  editorConfig = EditorConfig;
  imgSrc: any = null;
  isImageUpload: boolean = false;
  constructor(private fb: FormBuilder,
    private activeRoute: ActivatedRoute,
    private industryService: IndustryService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.createIndustryForm();
    this.sub$.sink = this.activeRoute.data.subscribe(
      (data: { industry: Industry }) => {
        if (data.industry) {
          this.isEditMode = true;
          this.industryForm.patchValue(data.industry);
          if (data.industry.imageUrl) {
            this.imgSrc = `${environment.apiUrl}${data.industry.imageUrl}`;
          }
        }
      });
  }

  createIndustryForm() {
    this.industryForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      shortDescription: [''],
      description: [''],
      imageUrl: ['']
    });
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

  onIndustryubmit() {
    if (this.industryForm.valid) {
      const industy: Industry = this.industryForm.value;
      industy.imageData = this.imgSrc
      industy.isImageUpload =this.isImageUpload;
      if (!this.isEditMode) {
        this.industryService.saveIndustry(industy).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('INDUSTRY_ADDED_SUCCESSFULLY'));
          this.router.navigate(['/industry']);
        });
      } else {
        this.industryService.updateIndustry(industy, industy.id).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('INDUSTRY_UPDATED_SUCCESSFULLY'));
          this.router.navigate(['/industry']);
        });
      }
    } else {
      this.industryForm.markAllAsTouched()
    }
  }
}
