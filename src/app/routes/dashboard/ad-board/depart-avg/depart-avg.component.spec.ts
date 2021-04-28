import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartAvgComponent } from './depart-avg.component';

describe('DepartAvgComponent', () => {
  let component: DepartAvgComponent;
  let fixture: ComponentFixture<DepartAvgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartAvgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartAvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
