import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationTableComponent } from './consultation-table.component';

describe('ConsultationTableComponent', () => {
  let component: ConsultationTableComponent;
  let fixture: ComponentFixture<ConsultationTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationTableComponent]
    });
    fixture = TestBed.createComponent(ConsultationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
