import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '@core/domain-classes/article';
import { ArticleCategory } from '@core/domain-classes/article-category';
import { TranslationService } from '@core/services/translation.service';
import { environment } from '@environments/environment';
import { EditorConfig } from '@shared/editor.config';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { ArticleService } from '../article.service';

@Component({
  standalone: false,
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrls: ['./article-detail.component.scss']
})
export class ArticleDetailComponent extends BaseComponent implements OnInit {
  articleForm: UntypedFormGroup;
  titlePage = 'Add Article';
  article: Article;
  categories: ArticleCategory[] = [];
  isLoading = false;
  editorConfig= EditorConfig;
  isImageUpload = false;
  imgSrc: string | ArrayBuffer;
  constructor(private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private articleService: ArticleService,
    private toastrService: ToastrService,
    private translationService: TranslationService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.createArticleForm();
    this.getArticleCategory();
    const routeSub$ = this.route.data.subscribe(
      (data: { article: Article }) => {
        if (data.article) {
          this.article = data.article;
          this.titlePage = 'Update Article';
          this.patchArticle();
        } else {
          this.titlePage = 'Add Article';
        }
      }
    );
    this.sub$.add(routeSub$);
  }

  getArticleCategory() {
    this.sub$.sink = this.articleService.getArticleCategories().subscribe(d => {
      this.categories = d;
    })
  }

  patchArticle() {
    this.articleForm.patchValue({
      title: this.article.title,
      bannerUrl: this.article.bannerUrl,
      shortDescription: this.article.shortDescription,
      longDescription: this.article.longDescription,
      publishDate: this.article.publishDate,
      categoryId: this.article.categoryId,
    });
    if (this.article.bannerUrl) {
      this.imgSrc = `${environment.apiUrl}${this.article.bannerUrl}`;
    }
  }

  createArticleForm() {
    this.articleForm = this.fb.group({
      title: ['', [Validators.required]],
      bannerUrl: [''],
      shortDescription: ['', [Validators.required]],
      longDescription: ['', Validators.required],
      publishDate: ['', Validators.required],
      categoryId: ['', Validators.required],
    });
  }

  onArticleSubmit() {
    if (this.articleForm.valid) {
      const article: Article = Object.assign(this.articleForm.value, {
        bannerImageSrc: this.imgSrc,
        isImageUpload: this.isImageUpload
      });
      if (this.article) {
        this.articleService.updateArticle(this.article.id, article).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('ARTICLE_UPDATED_SUCCESSFULLY'));
          this.router.navigate(['/article']);
        });
      } else {
        this.articleService.saveArticle(article).subscribe(() => {
          this.toastrService.success(this.translationService.getValue('ARTICLE_ADDED_SUCCESSFULLY'));
          this.router.navigate(['/article']);
        });
      }
    } else {
      this.articleForm.markAllAsTouched();
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
    this.imgSrc = '';
    this.isImageUpload = true;
  }

}
