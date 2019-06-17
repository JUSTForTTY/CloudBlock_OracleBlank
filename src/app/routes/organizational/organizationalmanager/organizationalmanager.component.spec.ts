import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationalmanagerComponent } from './organizationalmanager.component';

describe('OrganizationalmanagerComponent', () => {
  let component: OrganizationalmanagerComponent;
  let fixture: ComponentFixture<OrganizationalmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrganizationalmanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationalmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
