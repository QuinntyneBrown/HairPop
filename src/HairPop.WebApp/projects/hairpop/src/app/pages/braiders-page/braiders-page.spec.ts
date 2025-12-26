import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraidersPage } from './braiders-page';

describe('BraidersPage', () => {
  let component: BraidersPage;
  let fixture: ComponentFixture<BraidersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraidersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraidersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
