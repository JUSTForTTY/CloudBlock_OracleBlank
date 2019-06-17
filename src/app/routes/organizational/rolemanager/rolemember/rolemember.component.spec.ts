import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolememberComponent } from './rolemember.component';

describe('RolememberComponent', () => {
  let component: RolememberComponent;
  let fixture: ComponentFixture<RolememberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolememberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolememberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
