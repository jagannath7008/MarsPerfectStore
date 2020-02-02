import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageskuportfolioComponent } from './manageskuportfolio.component';

describe('ManageskuportfolioComponent', () => {
  let component: ManageskuportfolioComponent;
  let fixture: ComponentFixture<ManageskuportfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageskuportfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageskuportfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
