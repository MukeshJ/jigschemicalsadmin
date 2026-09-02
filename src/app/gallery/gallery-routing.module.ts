import { NgModule } from '@angular/core';
import { GalleryListComponent } from './gallery-list/gallery-list.component';
import { GalleryDetailComponent } from './gallery-detail/gallery-detail.component';
import { GalleryResolverService } from './gallery-detail/gallery-resolver.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: GalleryListComponent,
    data: { claimType: 'event_gallery_view_galleries' },
    canActivate: [AuthGuard]
  },
  {
    path: 'manage/:id',
    component: GalleryDetailComponent,
    resolve: {
      gallery: GalleryResolverService
    },
    data: { claimType: ['event_gallery_add_gallery', 'event_gallery_update_gallery'] },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GalleryRoutingModule { }
