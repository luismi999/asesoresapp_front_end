import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyJoinsComponent } from './my-joins.component';

describe('MyJoinsComponent', () => {
  let component: MyJoinsComponent;
  let fixture: ComponentFixture<MyJoinsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyJoinsComponent]
    });
    fixture = TestBed.createComponent(MyJoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
