import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUserAdvisorComponent } from './view-user-advisor.component';

describe('ViewUserAdvisorComponent', () => {
  let component: ViewUserAdvisorComponent;
  let fixture: ComponentFixture<ViewUserAdvisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewUserAdvisorComponent]
    });
    fixture = TestBed.createComponent(ViewUserAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
