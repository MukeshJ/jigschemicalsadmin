import { Component, Inject, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DeliveryMethod } from '@core/domain-classes/delivery-method';
import { DeliveryMethodService } from '@core/services/delivery-method.service';
import { TranslationService } from '@core/services/translation.service';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from 'src/app/base.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-delivery-method',
  templateUrl: './manage-delivery-method.component.html',
  styleUrls: ['./manage-delivery-method.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe],
})
export class ManageDeliveryMethodComponent extends BaseComponent implements OnInit {
  isEdit: boolean = false;
  deliveryMethodForm: UntypedFormGroup;
  constructor(
    public dialogRef: MatDialogRef<ManageDeliveryMethodComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeliveryMethod,
    private deliveryMethodService: DeliveryMethodService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
    private translationService: TranslationService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.createForm();
    if (this.data.id) {
      this.deliveryMethodForm.patchValue(this.data);
      this.isEdit = true;
    }
  }

  createForm() {
    this.deliveryMethodForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  saveDeliveryMethod(): void {
    if (!this.deliveryMethodForm.valid) {
      this.deliveryMethodForm.markAllAsTouched();
      return;
    }
    const deliveryMethod: DeliveryMethod = this.deliveryMethodForm.value;

    if (this.data.id) {
      this.deliveryMethodService.update(deliveryMethod).subscribe(() => {
        this.toastrService.success(
          this.translationService.getValue('DELIVERY_METHOD_UPDATED_SUCCESSFULLY'),
        );
        this.dialogRef.close();
      });
    } else {
      this.deliveryMethodService.add(deliveryMethod).subscribe(() => {
        this.toastrService.success(
          this.translationService.getValue('DELIVERY_METHOD_SAVED_SUCCESSFULLY'),
        );
        this.dialogRef.close();
      });
    }
  }
}
