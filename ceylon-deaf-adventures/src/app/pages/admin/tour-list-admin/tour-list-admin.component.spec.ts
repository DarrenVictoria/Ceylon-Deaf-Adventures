import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TourListAdminComponent } from './tour-list-admin.component';

describe('TourListAdminComponent', () => {
  let component: TourListAdminComponent;
  let fixture: ComponentFixture<TourListAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TourListAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TourListAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
