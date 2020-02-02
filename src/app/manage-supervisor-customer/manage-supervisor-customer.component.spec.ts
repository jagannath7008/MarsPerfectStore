import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSupervisorCustomerComponent } from './manage-supervisor-customer.component';

describe('ManageSupervisorCustomerComponent', () => {
  let component: ManageSupervisorCustomerComponent;
  let fixture: ComponentFixture<ManageSupervisorCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSupervisorCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSupervisorCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
