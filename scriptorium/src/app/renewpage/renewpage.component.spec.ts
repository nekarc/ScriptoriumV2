import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewpageComponent } from './renewpage.component';

describe('RenewpageComponent', () => {
  let component: RenewpageComponent;
  let fixture: ComponentFixture<RenewpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
