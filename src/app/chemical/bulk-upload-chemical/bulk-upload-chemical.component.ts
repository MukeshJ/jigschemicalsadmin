import { Component, OnInit } from '@angular/core';
import { UploadChemical } from '@core/domain-classes/uploadChemical';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalService } from '../chemical.service';
import * as XLSX from 'xlsx';
import { HasClaimDirective } from '../../shared/has-claim.directive';
import { NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-bulk-upload-chemical',
  templateUrl: './bulk-upload-chemical.component.html',
  styleUrls: ['./bulk-upload-chemical.component.scss'],
  imports: [HasClaimDirective, NgIf, MatProgressSpinner],
})
export class BulkUploadChemicalComponent extends BaseComponent implements OnInit {
  formData = new FormData();
  fileName = '';
  response: UploadChemical;
  isUpload: boolean = false;
  isLoading = false;
  displayedColumns: string[] = ['action', 'name', 'count'];
  constructor(
    private chemicalService: ChemicalService,
    private toastrService: ToastrService,
  ) {
    super();
  }

  ngOnInit(): void {}

  onFileSelected(event) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileName = file.name;
      this.formData.append('file', file);
      this.isUpload = true;
    }
  }

  upload() {
    if (this.isUpload) {
      this.isLoading = true;
      this.chemicalService.bulkuUloadChemicals(this.formData).subscribe(
        (data) => {
          this.response = data;
          this.isLoading = false;
          this.toastrService.success('Product Upload Successfully');
        },
        () => (this.isLoading = false),
      );
    } else {
      this.toastrService.error('Please Select file');
    }
  }

  onDownloadReport(recordType) {
    let heading = [
      [
        'Name',
        'Unit',
        'Category',
        'Cas number',
        'H bond acceptor',
        'H bond donor',
        'Iupac name',
        'InChIKey',
        'Molecular weight',
        'Molecular formula',
        'Synonyms',
        'Image',
      ],
    ];

    let expensesReport = [];
    this.response[recordType].forEach((report: any) => {
      expensesReport.push({
        name: report.data.name,
        unit: report.data.unit,
        category: report.data.category,
        casnumber: report.data.casnumber,
        hbondacceptor: report.data.hbondacceptor,
        hbonddonor: report.data.hbonddonor,
        iupacname: report.data.iupacname,
        inChIKey: report.data.inChIKey,
        molecularweight: report.data.molecularweight,
        molecularformula: report.data.molecularformula,
        synonyms: report.data.synonyms,
        image: report.image,
        error: report.errorMessage,
      });
    });

    let workBook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(workBook, heading);
    let workSheet = XLSX.utils.sheet_add_json(workBook, expensesReport, {
      origin: 'A2',
      skipHeader: true,
    });
    XLSX.utils.book_append_sheet(workBook, workSheet, 'Product Report');
    XLSX.writeFile(workBook, 'Product report' + '.xlsx');
  }
}
