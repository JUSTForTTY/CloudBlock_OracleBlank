import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicflowstyleComponent } from './publicflowstyle.component';

describe('PublicflowstyleComponent', () => {
  let component: PublicflowstyleComponent;
  let fixture: ComponentFixture<PublicflowstyleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicflowstyleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicflowstyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
