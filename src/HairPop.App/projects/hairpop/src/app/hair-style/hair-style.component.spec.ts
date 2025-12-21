import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairStyleComponent } from './hair-style.component';

describe('HairStyleComponent', () => {
  let component: HairStyleComponent;
  let fixture: ComponentFixture<HairStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairStyleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
