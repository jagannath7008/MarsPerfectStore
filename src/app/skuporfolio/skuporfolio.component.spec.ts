import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkuporfolioComponent } from './skuporfolio.component';

describe('SkuporfolioComponent', () => {
  let component: SkuporfolioComponent;
  let fixture: ComponentFixture<SkuporfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkuporfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkuporfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
