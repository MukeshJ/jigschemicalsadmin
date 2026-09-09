import { Component, Inject, OnInit, inject } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Chemical } from '@core/domain-classes/chemical';
import { Inventory } from '@core/domain-classes/inventory/inventory';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { ChemicalLocalStore } from 'src/app/chemical/chemical-store';
import { InventoryService } from '../inventory.service';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatDivider } from '@angular/material/divider';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-manage-inventory',
  templateUrl: './manage-inventory.component.html',
  styleUrls: ['./manage-inventory.component.scss'],
  imports: [FormsModule, ReactiveFormsModule, MatSelect, MatDivider, MatOption, TranslatePipe],
  providers: [ChemicalLocalStore],
})
export class ManageInventoryComponent extends BaseComponent implements OnInit {
  inventoryForm: UntypedFormGroup;
  chemicals: Chemical[] = [];

  private readonly chemicalStore = inject(ChemicalLocalStore);

  constructor(
    public dialogRef: MatDialogRef<ManageInventoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inventory,
    private inventoryService: InventoryService,
    private toastrService: ToastrService,
    private fb: UntypedFormBuilder,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getChemicals();
    this.createForm();
    this.chemicalNameChangeValue();
    if (this.data.chemicalId) {
      this.inventoryForm.get('filerChemical').setValue(this.data.chemicalName);
      this.inventoryForm.get('chemicalId').setValue(this.data.chemicalId);
    }
  }

  createForm() {
    this.inventoryForm = this.fb.group({
      id: [''],
      stock: ['', [Validators.required, Validators.min(1)]],
      filerChemical: [],
      chemicalName: [''],
      chemicalId: ['', [Validators.required]],
      pricePerUnit: ['', [Validators.required]],
    });
  }

  getChemicals() {
    this.chemicalStore.searchChemicals('').subscribe((chemicals) => {
      this.chemicals = [...(chemicals ?? [])];
    });
  }

  chemicalNameChangeValue() {
    this.sub$.sink = this.inventoryForm
      .get('filerChemical')
      .valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((c) => this.chemicalStore.searchChemicals(c)),
      )
      .subscribe((chemicals: Chemical[]) => {
        this.chemicals = [...(chemicals ?? [])];
        if (this.data.id) {
          this.inventoryForm.get('chemicalId').setValue(this.data.chemicalId);
        }
      });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  addInventory(): void {
    if (!this.inventoryForm.valid) {
      this.inventoryForm.markAllAsTouched();
      return;
    }
    const inventory: Inventory = this.inventoryForm.value;
    this.inventoryService.addInventory(inventory).subscribe(() => {
      this.toastrService.success('Inventory Saved Successfully');
      this.dialogRef.close(true);
    });
  }
}
