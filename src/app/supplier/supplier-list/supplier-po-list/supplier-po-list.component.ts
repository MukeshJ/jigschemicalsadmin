import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { PurchaseOrder } from '@core/domain-classes/purchase-order/purchase-order';
import { PurchaseOrderResourceParameter } from '@core/domain-classes/purchase-order/purchase-order-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { merge, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { PurchaseOrderDataSource } from 'src/app/purchase-order/purchase-order-list/purchase-order-datasource';
import { PurchaseOrderService } from 'src/app/purchase-order/purchase-order.service';
import { NgClass } from '@angular/common';
import {
  MatTable,
  MatColumnDef,
  MatHeaderCellDef,
  MatHeaderCell,
  MatCellDef,
  MatCell,
  MatFooterCellDef,
  MatFooterCell,
  MatNoDataRow,
  MatHeaderRowDef,
  MatHeaderRow,
  MatRowDef,
  MatRow,
  MatFooterRowDef,
  MatFooterRow,
} from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { PaymentStatusPipe } from '../../../shared/pipes/purchase-order-paymentStatus.pipe';
import { CustomCurrencyPipe } from '../../../shared/pipes/custome-currency.pipe';
import { UTCToLocalTime } from '../../../shared/pipes/utc-to-localtime.pipe';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-supplier-po-list',
  templateUrl: './supplier-po-list.component.html',
  styleUrls: ['./supplier-po-list.component.scss'],
  imports: [
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatSortHeader,
    MatCellDef,
    MatCell,
    RouterLink,
    NgClass,
    MatFooterCellDef,
    MatFooterCell,
    MatPaginator,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    MatFooterRowDef,
    MatFooterRow,
    PaymentStatusPipe,
    CustomCurrencyPipe,
    UTCToLocalTime,
    TranslatePipe,
  ],
})
export class SupplierPOListComponent extends BaseComponent implements OnChanges {
  @Input() supplierId: string;
  dataSource: PurchaseOrderDataSource;
  purchaseOrders: PurchaseOrder[] = [];
  displayedColumns: string[] = [
    'poCreatedDate',
    'orderNumber',
    'paymentStatus',
    'totalTax',
    'totalDiscount',
    'totalAmount',
  ];
  footerToDisplayed: string[] = ['footer'];
  purchaseOrderResource: PurchaseOrderResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private purchaseOrderService: PurchaseOrderService) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplierId']) {
      this.getPurchaseOrder();
    }
  }

  getPurchaseOrder(): void {
    this.purchaseOrderResource = new PurchaseOrderResourceParameter();
    this.purchaseOrderResource.pageSize = 5;
    this.purchaseOrderResource.orderBy = 'poCreatedDate asc';
    this.purchaseOrderResource.supplierId = this.supplierId;
    this.dataSource = new PurchaseOrderDataSource(this.purchaseOrderService);
    this.dataSource.loadData(this.purchaseOrderResource);
    this.getResourceParameter();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.purchaseOrderResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.purchaseOrderResource.pageSize = this.paginator.pageSize;
          this.purchaseOrderResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.purchaseOrderResource);
        }),
      )
      .subscribe();
  }

  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$.subscribe((c: ResponseHeader) => {
      if (c) {
        this.purchaseOrderResource.pageSize = c.pageSize;
        this.purchaseOrderResource.skip = c.skip;
        this.purchaseOrderResource.totalCount = c.totalCount;
      }
    });
  }
}
