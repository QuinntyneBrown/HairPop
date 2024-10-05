import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairStylesPageComponent } from './hair-styles-page.component';

describe('HairStylesPageComponent', () => {
  let component: HairStylesPageComponent;
  let fixture: ComponentFixture<HairStylesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairStylesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairStylesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
