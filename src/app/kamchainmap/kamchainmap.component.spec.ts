import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KamchainmapComponent } from './kamchainmap.component';

describe('KamchainmapComponent', () => {
  let component: KamchainmapComponent;
  let fixture: ComponentFixture<KamchainmapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KamchainmapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KamchainmapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
