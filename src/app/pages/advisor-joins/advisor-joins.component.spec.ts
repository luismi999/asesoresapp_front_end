import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvisorJoinsComponent } from './advisor-joins.component';

describe('AdvisorJoinsComponent', () => {
  let component: AdvisorJoinsComponent;
  let fixture: ComponentFixture<AdvisorJoinsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdvisorJoinsComponent]
    });
    fixture = TestBed.createComponent(AdvisorJoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
