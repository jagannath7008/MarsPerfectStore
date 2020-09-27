import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalbudgetplanComponent } from './approvalbudgetplan.component';

describe('ApprovalbudgetplanComponent', () => {
  let component: ApprovalbudgetplanComponent;
  let fixture: ComponentFixture<ApprovalbudgetplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalbudgetplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalbudgetplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
