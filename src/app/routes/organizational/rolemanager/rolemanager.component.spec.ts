import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolemanagerComponent } from './rolemanager.component';

describe('RolemanagerComponent', () => {
  let component: RolemanagerComponent;
  let fixture: ComponentFixture<RolemanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolemanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolemanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
