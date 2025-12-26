import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Braider } from './braider';

describe('Braider', () => {
  let component: Braider;
  let fixture: ComponentFixture<Braider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Braider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Braider);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
