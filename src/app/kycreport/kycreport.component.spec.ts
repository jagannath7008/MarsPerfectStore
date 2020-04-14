import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycreportComponent } from './kycreport.component';

describe('KycreportComponent', () => {
  let component: KycreportComponent;
  let fixture: ComponentFixture<KycreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
