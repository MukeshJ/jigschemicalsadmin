import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentCategoryListComponent } from './document-category-list.component';

describe('CategoryListComponent', () => {
  let component: DocumentCategoryListComponent;
  let fixture: ComponentFixture<DocumentCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
