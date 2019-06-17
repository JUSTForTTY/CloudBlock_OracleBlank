import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagercenterComponent } from './managercenter.component';

describe('ManagercenterComponent', () => {
  let component: ManagercenterComponent;
  let fixture: ComponentFixture<ManagercenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagercenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagercenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
