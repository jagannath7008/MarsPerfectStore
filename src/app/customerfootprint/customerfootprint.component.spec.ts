import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerfootprintComponent } from './customerfootprint.component';

describe('CustomerfootprintComponent', () => {
  let component: CustomerfootprintComponent;
  let fixture: ComponentFixture<CustomerfootprintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerfootprintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerfootprintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
