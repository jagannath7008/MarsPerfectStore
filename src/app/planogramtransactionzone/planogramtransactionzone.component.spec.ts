import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanogramtransactionzoneComponent } from './planogramtransactionzone.component';

describe('PlanogramtransactionzoneComponent', () => {
  let component: PlanogramtransactionzoneComponent;
  let fixture: ComponentFixture<PlanogramtransactionzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanogramtransactionzoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogramtransactionzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
