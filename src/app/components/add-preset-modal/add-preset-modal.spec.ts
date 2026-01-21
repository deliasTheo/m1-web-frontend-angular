import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPresetModal } from './add-preset-modal';

describe('AddPresetModal', () => {
  let component: AddPresetModal;
  let fixture: ComponentFixture<AddPresetModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPresetModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPresetModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
