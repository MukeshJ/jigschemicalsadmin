import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { SupplierService } from '../supplier.service';
import * as XLSX from 'xlsx';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { Supplier } from 'src/app/core/domain-classes/supplier';
import { UploadChemical } from 'src/app/core/domain-classes/uploadChemical';

@Component({
  selector: 'app-bulk-upload-supplier',
  templateUrl: './bulk-upload-supplier.component.html',
  styleUrls: ['./bulk-upload-supplier.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [HasClaimDirective],
})
export class BulkUploadSupplierComponent extends BaseComponent {
  formData = new FormData();
  fileName = '';
  response: UploadChemical;
  isUpload: boolean = false;
  constructor(
    private supplierService: SupplierService,
    private toastrService: ToastrService,
  ) {
    super();
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      // API reads Files[0], so replace instead of appending on re-selection
      this.formData = new FormData();
      this.formData.append('file', file);
      this.isUpload = true;
      this.response = null;
    }
  }

  upload() {
    if (this.isUpload) {
      this.sub$.sink = this.supplierService.bulkUploadSuppliers(this.formData).subscribe(
        (data) => {
          this.response = data;
          this.toastrService.success('Supplier Upload Successfully');
        },
        () => {},
      );
    } else {
      this.toastrService.error('Please Select file');
    }
  }

  onDownloadReport(recordType: keyof UploadChemical) {
    let heading = [
      [
        'Supplier Name',
        'Contact Person',
        'Email',
        'Mobile No',
        'Phone No',
        'Website',
        'Address',
        'Description',
      ],
    ];

    let suppliersReport = [];
    (this.response[recordType] ?? []).forEach((report: any) => {
      const supplier: Supplier = report.data ?? report;
      suppliersReport.push({
        supplierName: supplier.supplierName,
        contactPerson: supplier.contactPerson,
        email: supplier.email ?? supplier.supplierEmails?.[0]?.email,
        mobileNo: supplier.mobileNo,
        phoneNo: supplier.phoneNo,
        website: supplier.website,
        address: supplier.supplierAddresses?.[0]?.address,
        description: supplier.description,
      });
    });

    let workBook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(workBook, heading);
    let workSheet = XLSX.utils.sheet_add_json(workBook, suppliersReport, {
      origin: 'A2',
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Supplier Report');
    XLSX.writeFile(workBook, 'Supplier report' + '.xlsx');
  }
}
