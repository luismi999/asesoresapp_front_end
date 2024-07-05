import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartConsultationsComponent } from './chart-consultations.component';

describe('ChartConsultationsComponent', () => {
  let component: ChartConsultationsComponent;
  let fixture: ComponentFixture<ChartConsultationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChartConsultationsComponent]
    });
    fixture = TestBed.createComponent(ChartConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
