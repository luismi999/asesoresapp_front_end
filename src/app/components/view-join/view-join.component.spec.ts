import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJoinComponent } from './view-join.component';

describe('ViewJoinComponent', () => {
  let component: ViewJoinComponent;
  let fixture: ComponentFixture<ViewJoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewJoinComponent]
    });
    fixture = TestBed.createComponent(ViewJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
