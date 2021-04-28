import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartCountComponent } from './depart-count.component';

describe('DepartCountComponent', () => {
  let component: DepartCountComponent;
  let fixture: ComponentFixture<DepartCountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartCountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
