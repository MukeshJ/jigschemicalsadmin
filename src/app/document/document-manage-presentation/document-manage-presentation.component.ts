import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Category } from '@core/domain-classes/category';
import { DocumentInfo } from '@core/domain-classes/document-info';
import { FileInfo } from '@core/domain-classes/file-info';
import { environment } from '@environments/environment';
import { BaseComponent } from 'src/app/base.component';

@Component({
  selector: 'app-document-manage-presentation',
  templateUrl: './document-manage-presentation.component.html',
  styleUrls: ['./document-manage-presentation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentManagePresentationComponent extends BaseComponent implements OnInit {

  documentForm: FormGroup;
  extension: string = '';
  @Input() categories: Category[];
  @Input() loading: boolean;
  documentSource: string;
  @Output() onSaveDocument: EventEmitter<DocumentInfo> = new EventEmitter<DocumentInfo>();
  progress: number = 0;
  message: string = '';
  fileInfo: FileInfo;
  showProgress: boolean = false;
  isFileUpload: boolean = false;

  constructor(
    private fb: FormBuilder,
    private httpClient: HttpClient,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  ngOnInit(): void {
    this.createDocumentForm();
  }

  onDocumentChange($event: any) {
    const files = $event.target.files || $event.srcElement.files;
    const file_url = files[0];
    this.extension = file_url.name.split('.').pop();
    if (this.fileExtesionValidation(this.extension)) {
      var reader = new FileReader();
      reader.onload = (e: any) => {
        this.documentSource = e.target.result;
        this.fileUploadValidation('upload');
      }
      reader.readAsDataURL(file_url);
    } else {
      this.documentSource = null;
      this.fileUploadValidation('');
    }
  }

  fileUploadValidation(fileName: string) {
    this.documentForm.patchValue({
      url: fileName
    })
    this.documentForm.get('url').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileUploadSizeValidation(fileSize: string) {
    this.documentForm.patchValue({
      fileSize: fileSize
    })
    this.documentForm.get('fileSize').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }
  fileUploadExtensionValidation(extension: string) {
    this.documentForm.patchValue({
      extension: extension
    })
    this.documentForm.get('extension').markAsTouched();
    this.documentForm.updateValueAndValidity();
  }

  fileExtesionValidation(extesion: string): string {
    const allowExtesions = environment.allowExtesions;
    return allowExtesions.find(c => c === extesion);
  }

  createDocumentForm() {
    this.documentForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      categoryId: ['', [Validators.required]],
      url: ['', [Validators.required]],
      fileSize: ['', [Validators.required]],
      extension: ['', [Validators.required]]
    });
  }

  SaveDocument() {
    if (this.documentForm.valid) {
      this.onSaveDocument.emit(this.buildDocumentObject());
    } else {
      this.markFormGroupTouched(this.documentForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

  buildDocumentObject(): DocumentInfo {
    const document: DocumentInfo = {
      id: this.fileInfo.id,
      categoryId: this.documentForm.get('categoryId').value,
      description: this.documentForm.get('description').value,
      name: this.documentForm.get('name').value,
      url: this.fileInfo.fileName
    };
    return document;
  }

  upload(files) {
    if (files.length === 0)
      return;
    this.extension = files[0].name.split('.').pop();
    this.showProgress = true;
    if (!this.fileExtesionValidation(this.extension)) {
      this.fileUploadExtensionValidation('');
      this.showProgress = false;
      this.cd.markForCheck();
      return;
    } else {
      this.fileUploadExtensionValidation('valid');
    }
    const size = files[0].size;
    if (size > environment.maximumFileSize) {
      this.fileUploadSizeValidation('');
      this.showProgress = false;
      this.cd.markForCheck();
      return;
    } else {
      this.fileUploadSizeValidation('valid');
    }
    const formData = new FormData();
    for (let file of files)
      formData.append(file.name, file);
    const uploadReq = new HttpRequest('POST', `api/document/upload`, formData, {
      reportProgress: true,
    });

    this.sub$.sink = this.httpClient.request(uploadReq)
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          this.cd.markForCheck();
        }
        else if (event.type === HttpEventType.Response) {
          this.fileInfo = event.body as FileInfo;
          this.fileUploadValidation(this.fileInfo.fileName);
          this.isFileUpload=true;
          this.cd.markForCheck();
        }
      });
  }
}

