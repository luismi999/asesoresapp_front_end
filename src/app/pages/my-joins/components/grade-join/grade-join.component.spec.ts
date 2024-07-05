import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GradeJoinComponent } from './grade-join.component';

describe('GradeJoinComponent', () => {
  let component: GradeJoinComponent;
  let fixture: ComponentFixture<GradeJoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GradeJoinComponent]
    });
    fixture = TestBed.createComponent(GradeJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
