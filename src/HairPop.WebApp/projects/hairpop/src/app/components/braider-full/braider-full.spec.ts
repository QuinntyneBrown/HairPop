import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraiderFull } from './braider-full';

describe('BraiderFull', () => {
  let component: BraiderFull;
  let fixture: ComponentFixture<BraiderFull>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraiderFull]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraiderFull);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
