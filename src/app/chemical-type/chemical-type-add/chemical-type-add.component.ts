import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChemicalType } from '@core/domain-classes/chemical-type';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { EditorConfig } from '@shared/editor.config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalTypeService } from '../chemical-type.service';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { MatCard, MatCardActions } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-chemical-type-add',
  templateUrl: './chemical-type-add.component.html',
  styleUrls: ['./chemical-type-add.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatSlideToggle,
    AngularEditorModule,
    MatCard,
    MatCardActions,
    TranslatePipe,
  ],
})
export class ChemicalTypeAddComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  chemicalTypeForm: UntypedFormGroup;
  imgSrc: any = null;
  editorConfig = EditorConfig;
  isImageUpload: boolean = false;
  constructor(
    public dialogRef: MatDialogRef<ChemicalTypeAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChemicalType,
    private chemicalTypeService: ChemicalTypeService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private fb: UntypedFormBuilder,
  ) {
    super();
  }
  ngOnInit() {
    this.chemicalTypeForm = this.fb.group({
      name: [this.data ? this.data.name : '', [Validators.required]],
      shortDescription: [this.data ? this.data.shortDescription : ''],
      description: [this.data ? this.data.description : ''],
      imageUrl: [''],
      isShowFront: [this.data ? this.data.isShowFront : false],
    });
    if (this.data && this.data.id) {
      this.isEdit = true;
      if (this.data.imageUrl) {
        this.imgSrc = `${environment.apiUrl}${this.data.imageUrl}`;
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
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
    };
  }

  onRemoveImage() {
    this.isImageUpload = true;
    this.imgSrc = '';
  }

  saveChemicalType(): void {
    if (this.chemicalTypeForm.valid) {
      const chemicalType: ChemicalType = this.chemicalTypeForm.value;
      chemicalType.imageData = this.imgSrc;
      chemicalType.isImageUpload = this.isImageUpload;
      if (this.data.id) {
        this.sub$.sink = this.chemicalTypeService
          .updateChemicalType(this.data.id, chemicalType)
          .subscribe(() => {
            this.toastrService.success(
              this.translationService.getValue('CHEMICALTYPE_UPDATED_SUCCESSFULLY'),
            );
            this.dialogRef.close(true);
          });
      } else {
        this.sub$.sink = this.chemicalTypeService.saveChemicalType(chemicalType).subscribe(() => {
          this.toastrService.success(
            this.translationService.getValue('CHEMICALTYPE_SAVED_SUCCESSFULLY'),
          );
          this.dialogRef.close(true);
        });
      }
    } else {
      this.chemicalTypeForm.markAllAsTouched();
    }
  }
  onNoClick() {
    this.dialogRef.close();
  }
}
