import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupervisorCustomerComponent } from './supervisor-customer.component';

describe('SupervisorCustomerComponent', () => {
  let component: SupervisorCustomerComponent;
  let fixture: ComponentFixture<SupervisorCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupervisorCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupervisorCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
