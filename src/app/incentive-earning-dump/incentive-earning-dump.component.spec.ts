import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveEarningDumpComponent } from './incentive-earning-dump.component';

describe('IncentiveEarningDumpComponent', () => {
  let component: IncentiveEarningDumpComponent;
  let fixture: ComponentFixture<IncentiveEarningDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncentiveEarningDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncentiveEarningDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
