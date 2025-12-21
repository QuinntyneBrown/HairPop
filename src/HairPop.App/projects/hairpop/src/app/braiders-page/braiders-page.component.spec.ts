import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraidersPageComponent } from './braiders-page.component';

describe('BraidersPageComponent', () => {
  let component: BraidersPageComponent;
  let fixture: ComponentFixture<BraidersPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraidersPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraidersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
