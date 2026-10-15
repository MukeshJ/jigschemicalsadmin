import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CompanyProfile } from '@core/domain-classes/company-profile';
import { SecurityService } from '@core/security/security.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  companyProfile: CompanyProfile;
  constructor(private securityService: SecurityService) {}

  ngOnInit(): void {
    this.companyProfileSubscription();
  }

  companyProfileSubscription() {
    this.securityService.companyProfile.subscribe((profile) => {
      if (profile) {
        this.companyProfile = profile;
      }
    });
  }
}
