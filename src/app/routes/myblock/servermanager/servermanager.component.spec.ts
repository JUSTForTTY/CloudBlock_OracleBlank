import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServermanagerComponent } from './servermanager.component';

describe('ServermanagerComponent', () => {
  let component: ServermanagerComponent;
  let fixture: ComponentFixture<ServermanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServermanagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServermanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
