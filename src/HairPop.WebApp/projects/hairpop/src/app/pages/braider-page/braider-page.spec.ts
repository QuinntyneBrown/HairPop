import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraiderPage } from './braider-page';

describe('BraiderPage', () => {
  let component: BraiderPage;
  let fixture: ComponentFixture<BraiderPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraiderPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraiderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
