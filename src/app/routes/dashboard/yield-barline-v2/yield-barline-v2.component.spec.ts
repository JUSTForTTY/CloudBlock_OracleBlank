import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldBarlineV2Component } from './yield-barline-v2.component';

describe('YieldBarlineV2Component', () => {
  let component: YieldBarlineV2Component;
  let fixture: ComponentFixture<YieldBarlineV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldBarlineV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldBarlineV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
