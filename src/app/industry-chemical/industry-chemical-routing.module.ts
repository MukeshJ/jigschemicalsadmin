import { NgModule } from '@angular/core';
import { IndustryChemicalComponent } from './industry-chemical.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: IndustryChemicalComponent,
    data: { claimType: 'industry_assign_chemicals_to_industry' },
    canActivate: [AuthGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndustryChemicalRoutingModule { }
