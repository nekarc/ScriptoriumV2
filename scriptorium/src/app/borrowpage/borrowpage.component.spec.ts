import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowpageComponent } from './borrowpage.component';

describe('BorrowpageComponent', () => {
  let component: BorrowpageComponent;
  let fixture: ComponentFixture<BorrowpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
