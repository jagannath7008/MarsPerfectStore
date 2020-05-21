import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialvisibilitydetailComponent } from './specialvisibilitydetail.component';

describe('SpecialvisibilitydetailComponent', () => {
  let component: SpecialvisibilitydetailComponent;
  let fixture: ComponentFixture<SpecialvisibilitydetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialvisibilitydetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialvisibilitydetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
