import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContactUs } from '@core/domain-classes/contact-us';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { ContactUsService } from '../contact-us.service';
import { UTCToLocalTime } from '../../shared/pipes/utc-to-localtime.pipe';
import { ContactRequestTypePipe } from '../../shared/pipes/contact-request-type-pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us-detail',
  templateUrl: './contact-us-detail.component.html',
  styleUrls: ['./contact-us-detail.component.scss'],
  imports: [ UTCToLocalTime, ContactRequestTypePipe, TranslatePipe],
})
export class ContactUsDetailComponent implements OnInit {
  isDownloading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public contactUs: ContactUs,
    public dialogRef: MatDialogRef<ContactUsDetailComponent>,
    private contactUsService: ContactUsService,
    private translationService: TranslationService,
    private toastrService: ToastrService,
  ) {}

  ngOnInit(): void {}

  closeDialog() {
    this.dialogRef.close();
  }

  downloadResume(contactUs: ContactUs): void {
    if (!contactUs || !contactUs.id || this.isDownloading) {
      return;
    }
    this.isDownloading = true;
    this.contactUsService.downloadResume(contactUs.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${contactUs.resumeUrl || 'resume'}`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastrService.success(
          this.translationService.getValue('FILE_DOWNLOADED_SUCCESSFULLY'),
        );
        this.isDownloading = false;
      },
      error: () => {
        this.toastrService.error(
          this.translationService.getValue('ERROR_WHILE_DOWNLOADING_DOCUMENT'),
        );
        this.isDownloading = false;
      },
    });
  }
}
