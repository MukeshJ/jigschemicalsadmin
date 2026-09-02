import { NgModule } from '@angular/core';
import { ArticleListComponent } from './article-list/article-list.component';
import { RouterModule, Routes } from '@angular/router';
import { ArticleDetailComponent } from './article-detail/article-detail.component';
import { ArticleDetailResolverService } from './article-detail/article-detail-resolver.service';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ArticleListComponent,
    data: { claimType: 'article_view_articles' },
    canActivate: [AuthGuard]
  }, {
    path: 'manage/:id',
    component: ArticleDetailComponent,
    canActivate: [AuthGuard],
    data: { claimType: ['article_add_article', 'article_update_article'], },
    resolve: {
      article: ArticleDetailResolverService,
    },
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ArticleRoutingModule { }
