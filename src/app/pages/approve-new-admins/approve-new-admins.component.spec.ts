import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveNewAdminsComponent } from './approve-new-admins.component';

describe('ApproveNewAdminsComponent', () => {
  let component: ApproveNewAdminsComponent;
  let fixture: ComponentFixture<ApproveNewAdminsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApproveNewAdminsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveNewAdminsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
