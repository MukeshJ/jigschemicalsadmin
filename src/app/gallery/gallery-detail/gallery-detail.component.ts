import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Gallery } from '@core/domain-classes/gallery';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { GalleryService } from '../gallery.service';
import { galleryCategories } from '../categories-enum';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCard, MatCardActions } from '@angular/material/card';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-gallery-detail',
  templateUrl: './gallery-detail.component.html',
  styleUrls: ['./gallery-detail.component.scss'],
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
export class GalleryDetailComponent extends BaseComponent implements OnInit {
  isEditMode = false;
  isLoading = false;
  galleryForm: UntypedFormGroup;
  imgSrc: any = null;
  isImageUpload = false;
  galleryCategories = galleryCategories;
  constructor(
    private fb: UntypedFormBuilder,
    private activeRoute: ActivatedRoute,
    private galleryService: GalleryService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private router: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.createGalleryForm();
    this.sub$.sink = this.activeRoute.data.subscribe((data: { gallery: Gallery }) => {
      if (data.gallery) {
        this.isEditMode = true;
        this.galleryForm.patchValue(data.gallery);
        if (data.gallery.url) {
          this.imgSrc = `${environment.apiUrl}${data.gallery.url}`;
        }
      }
    });
  }

  createGalleryForm() {
    this.galleryForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      description: [''],
    });
  }

  onFileSelect($event: any) {
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

  onGallerySubmit() {
    if (this.galleryForm.valid) {
      const gallery: Gallery = this.galleryForm.value;
      gallery.imageSrc = this.imgSrc;
      gallery.isImageUpload = this.isImageUpload;
      this.isLoading = true;
      if (!this.isEditMode) {
        this.sub$.sink = this.galleryService.saveGallery(gallery).subscribe(
          () => {
            this.isLoading = false;
            this.toastrService.success(
              this.translationService.getValue('GALLERY_ADDED_SUCCESSFULLY'),
            );
            this.router.navigate(['/gallery']);
          },
          () => (this.isLoading = false),
        );
      } else {
        this.sub$.sink = this.galleryService.updateGallery(gallery, gallery.id).subscribe(
          () => {
            this.isLoading = false;
            this.toastrService.success(
              this.translationService.getValue('GALLERY_UPDATED_SUCCESSFULLY'),
            );
            this.router.navigate(['/gallery']);
          },
          () => (this.isLoading = false),
        );
      }
    } else {
      this.galleryForm.markAllAsTouched();
    }
  }
}
