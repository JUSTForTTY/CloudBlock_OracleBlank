import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldProductlineComponent } from './yield-productline.component';

describe('YieldProductlineComponent', () => {
  let component: YieldProductlineComponent;
  let fixture: ComponentFixture<YieldProductlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldProductlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldProductlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
