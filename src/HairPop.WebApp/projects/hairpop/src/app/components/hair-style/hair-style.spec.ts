import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairStyle } from './hair-style';

describe('HairStyle', () => {
  let component: HairStyle;
  let fixture: ComponentFixture<HairStyle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairStyle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairStyle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
