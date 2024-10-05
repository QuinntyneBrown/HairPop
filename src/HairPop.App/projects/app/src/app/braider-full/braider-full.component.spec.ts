import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BraiderFullComponent } from './braider-full.component';

describe('BraiderFullComponent', () => {
  let component: BraiderFullComponent;
  let fixture: ComponentFixture<BraiderFullComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BraiderFullComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BraiderFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
