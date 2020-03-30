import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanTableComponent } from './plan-table.component';

describe('PlanTableComponent', () => {
  let component: PlanTableComponent;
  let fixture: ComponentFixture<PlanTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
