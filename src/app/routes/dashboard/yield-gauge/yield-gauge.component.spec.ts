import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldGaugeComponent } from './yield-gauge.component';

describe('YieldGaugeComponent', () => {
  let component: YieldGaugeComponent;
  let fixture: ComponentFixture<YieldGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldGaugeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
