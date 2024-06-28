import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewJoinsComponent } from './view-joins.component';

describe('ViewJoinsComponent', () => {
  let component: ViewJoinsComponent;
  let fixture: ComponentFixture<ViewJoinsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewJoinsComponent]
    });
    fixture = TestBed.createComponent(ViewJoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
