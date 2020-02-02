import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanogrammainaisleComponent } from './planogrammainaisle.component';

describe('SkuComponent', () => {
  let component: PlanogrammainaisleComponent;
  let fixture: ComponentFixture<PlanogrammainaisleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanogrammainaisleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanogrammainaisleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
