import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraiderComponent } from './braider.component';

describe('BraiderComponent', () => {
  let component: BraiderComponent;
  let fixture: ComponentFixture<BraiderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraiderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraiderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
