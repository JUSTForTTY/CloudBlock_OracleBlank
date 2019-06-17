import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentmanagerComponent } from './departmentmanager.component';

describe('DepartmentmanagerComponent', () => {
  let component: DepartmentmanagerComponent;
  let fixture: ComponentFixture<DepartmentmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
