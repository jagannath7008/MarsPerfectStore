import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagebreadcrumbComponent } from './pagebreadcrumb.component';

describe('PagebreadcrumbComponent', () => {
  let component: PagebreadcrumbComponent;
  let fixture: ComponentFixture<PagebreadcrumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagebreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagebreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
