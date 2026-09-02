import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentCategoryListPresentationComponent } from './document-category-list-presentation.component';

describe('CategoryListPresentationComponent', () => {
  let component: DocumentCategoryListPresentationComponent;
  let fixture: ComponentFixture<DocumentCategoryListPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentCategoryListPresentationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentCategoryListPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
