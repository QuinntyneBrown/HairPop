import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraiderPageComponent } from './braider-page.component';

describe('BraiderPageComponent', () => {
  let component: BraiderPageComponent;
  let fixture: ComponentFixture<BraiderPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraiderPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraiderPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
