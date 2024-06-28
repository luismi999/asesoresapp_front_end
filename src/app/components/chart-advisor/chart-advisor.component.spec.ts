import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartAdvisorComponent } from './chart-advisor.component';

describe('ChartAdvisorComponent', () => {
  let component: ChartAdvisorComponent;
  let fixture: ComponentFixture<ChartAdvisorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartAdvisorComponent]
    });
    fixture = TestBed.createComponent(ChartAdvisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
