import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateJoinComponent } from './create-join.component';

describe('CreateJoinComponent', () => {
  let component: CreateJoinComponent;
  let fixture: ComponentFixture<CreateJoinComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateJoinComponent]
    });
    fixture = TestBed.createComponent(CreateJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
