import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Inventory } from '@core/domain-classes/inventory/inventory';
import { InventoryResourceParameter } from '@core/domain-classes/inventory/inventory-resource-parameter';
import { ResponseHeader } from '@core/domain-classes/response-header';
import { merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BaseComponent } from 'src/app/base.component';
import { InventoryService } from '../inventory.service';
import { ManageInventoryComponent } from '../manage-inventory/manage-inventory.component';
import { InventoryDataSource } from './inventory-datasource';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class InventoryListComponent extends BaseComponent implements OnInit {
  dataSource: InventoryDataSource;
  displayedColumns: string[] = ['action', 'chemicalName', 'stock', 'averagePurchasePrice', 'averageSalesPrice'];
  columnsToDisplay: string[] = ["footer"];
  inventoryResource: InventoryResourceParameter;
  loading$: Observable<boolean>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  _chemicalNameFilter: string;
  expandedElement: Inventory = null;

  public filterObservable$: Subject<string> = new Subject<string>();

  public get ChemicalNameFilter(): string {
    return this._chemicalNameFilter;
  }

  public set ChemicalNameFilter(v: string) {
    this._chemicalNameFilter = v;
    const nameFilter = `chemicalName##${v}`;
    this.filterObservable$.next(nameFilter);
  }

  constructor(
    private inventoryService: InventoryService,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog) {
    super();
    this.inventoryResource = new InventoryResourceParameter();
    this.inventoryResource.pageSize = 50;
    this.inventoryResource.orderBy = 'chemicalName asc'
  }

  ngOnInit(): void {
    this.dataSource = new InventoryDataSource(this.inventoryService);
    this.dataSource.loadData(this.inventoryResource);
    this.getResourceParameter();
    this.sub$.sink = this.filterObservable$
      .pipe(
        debounceTime(1000),
        distinctUntilChanged())
      .subscribe((c) => {
        this.inventoryResource.skip = 0;
        const strArray: Array<string> = c.split('##');
        if (strArray[0] === 'chemicalName') {
          this.inventoryResource.chemicalName = escape(strArray[1]);
        }
        this.dataSource.loadData(this.inventoryResource);
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.sub$.sink = merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.inventoryResource.skip = this.paginator.pageIndex * this.paginator.pageSize;
          this.inventoryResource.pageSize = this.paginator.pageSize;
          this.inventoryResource.orderBy = this.sort.active + ' ' + this.sort.direction;
          this.dataSource.loadData(this.inventoryResource);
        })
      )
      .subscribe();
  }


  getResourceParameter() {
    this.sub$.sink = this.dataSource.responseHeaderSubject$
      .subscribe((c: ResponseHeader) => {
        if (c) {
          this.inventoryResource.pageSize = c.pageSize;
          this.inventoryResource.skip = c.skip;
          this.inventoryResource.totalCount = c.totalCount;
        }
      });
  }

  toggleRow(element: Inventory) {
    this.expandedElement = this.expandedElement === element ? null : element;
    this.cd.detectChanges();
  }

  addInvenotry(inventory: Inventory) {
    const dialogRef = this.dialog.open(ManageInventoryComponent, {
      width: '450px',
      data: Object.assign({}, inventory)
    });
    dialogRef.afterClosed().subscribe((data: boolean) => {
      if (data) {
        this.dataSource.loadData(this.inventoryResource);
      }
    })
  }
}
