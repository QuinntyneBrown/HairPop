import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairStylesPage } from './hair-styles-page';

describe('HairStylesPage', () => {
  let component: HairStylesPage;
  let fixture: ComponentFixture<HairStylesPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairStylesPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairStylesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
