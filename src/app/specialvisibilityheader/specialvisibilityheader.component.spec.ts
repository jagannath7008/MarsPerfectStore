import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialvisibilityheaderComponent } from './specialvisibilityheader.component';

describe('SpecialvisibilityheaderComponent', () => {
  let component: SpecialvisibilityheaderComponent;
  let fixture: ComponentFixture<SpecialvisibilityheaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialvisibilityheaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialvisibilityheaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
