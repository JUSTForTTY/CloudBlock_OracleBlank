import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldBarlineComponent } from './yield-barline.component';

describe('YieldBarlineComponent', () => {
  let component: YieldBarlineComponent;
  let fixture: ComponentFixture<YieldBarlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldBarlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldBarlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
