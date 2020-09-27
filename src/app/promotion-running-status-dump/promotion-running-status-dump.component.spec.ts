import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionRunningStatusDumpComponent } from './promotion-running-status-dump.component';

describe('PromotionRunningStatusDumpComponent', () => {
  let component: PromotionRunningStatusDumpComponent;
  let fixture: ComponentFixture<PromotionRunningStatusDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromotionRunningStatusDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotionRunningStatusDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
