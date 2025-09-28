import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourDetailDialogComponent } from './tour-detail-dialog.component';

describe('TourDetailDialogComponent', () => {
  let component: TourDetailDialogComponent;
  let fixture: ComponentFixture<TourDetailDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourDetailDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
