import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HairpopComponents } from './hairpop-components';

describe('HairpopComponents', () => {
  let component: HairpopComponents;
  let fixture: ComponentFixture<HairpopComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HairpopComponents]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HairpopComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
