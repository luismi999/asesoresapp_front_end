import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyConsultationsComponent } from './my-consultations.component';

describe('MyAdvisorsComponent', () => {
  let component: MyConsultationsComponent;
  let fixture: ComponentFixture<MyConsultationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyConsultationsComponent]
    });
    fixture = TestBed.createComponent(MyConsultationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
