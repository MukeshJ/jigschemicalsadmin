import { Component, OnInit } from '@angular/core';
import { UploadChemical } from '@core/domain-classes/uploadChemical';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { SupplierService } from '../supplier.service';
import * as XLSX from 'xlsx';
import { Supplier } from '@core/domain-classes/supplier';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { SupplierChemicalService } from 'src/app/supplier-chemical/supplier-chemical.service';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SupplierResourceParameter } from '@core/domain-classes/supplier-resource-parameter';
import { MatAutocompleteTrigger, MatAutocomplete } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';
import { MatOption } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-chemical',
  templateUrl: './upload-chemical.component.html',
  styleUrls: ['./upload-chemical.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class UploadChemicalComponent extends BaseComponent implements OnInit {
  selectedSupplier: Supplier;
  supplierChemicalForm: UntypedFormGroup;
  formData = new FormData();
  fileName = '';
  response: UploadChemical;
  isUpload: boolean = false;
  isDisable: boolean = false;
  isLoading = false;
  suppliers$: Observable<Supplier[]>;
  supplierResource: SupplierResourceParameter;
  displayedColumns: string[] = ['action', 'name', 'count'];
  constructor(
    private supplierService: SupplierService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    private supplierChemicalService: SupplierChemicalService,
  ) {
    super();
    this.supplierResource = new SupplierResourceParameter();
  }

  ngOnInit(): void {
    this.createSupplierChemicalForm();
    this.suppliers$ = this.supplierChemicalForm.get('supplierNameInput').valueChanges.pipe(
      debounceTime(1000),
      tap(() => (this.isLoading = true)),
      switchMap((value) => {
        this.supplierResource.searchQuery = value;
        return this.supplierChemicalService.searchSupplier(this.supplierResource).pipe(
          tap(() => {
            this.isLoading = false;
          }),
        );
      }),
      finalize(() => {
        this.isLoading = false;
      }),
    );
  }

  createSupplierChemicalForm() {
    this.supplierChemicalForm = this.fb.group({
      supplierNameInput: [''],
    });
  }

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
      if (this.isDisable) {
        this.supplierService
          .uploadChemical(this.formData, this.selectedSupplier.id)
          .subscribe((data) => {
            this.response = data;
            this.toastrService.success('Product Upload Successfully');
          });
      } else {
        this.toastrService.error('Please Select Supplier');
      }
    } else {
      this.toastrService.error('Please Select file');
    }
  }

  selectSupplier = (supplier: Supplier) => {
    this.selectedSupplier = supplier;
    this.isDisable = true;
  };

  onDownloadReport(recordType) {
    let heading = [['Name', 'CAS Number']];

    let expensesReport = [];
    this.response[recordType].forEach((report: any) => {
      expensesReport.push({
        name: report.data.name,
        casNumber: report.data.casNumber,
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
