import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteModalComponent } from './write-modal.component';

describe('WriteModalComponent', () => {
  let component: WriteModalComponent;
  let fixture: ComponentFixture<WriteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
