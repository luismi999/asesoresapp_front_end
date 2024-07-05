import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationsMapComponent } from './consultations-map.component';

describe('ConsultationsMapComponent', () => {
  let component: ConsultationsMapComponent;
  let fixture: ComponentFixture<ConsultationsMapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationsMapComponent]
    });
    fixture = TestBed.createComponent(ConsultationsMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
