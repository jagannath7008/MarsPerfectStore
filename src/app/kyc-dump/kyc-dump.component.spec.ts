import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KycDumpComponent } from './kyc-dump.component';

describe('KycDumpComponent', () => {
  let component: KycDumpComponent;
  let fixture: ComponentFixture<KycDumpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KycDumpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KycDumpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
