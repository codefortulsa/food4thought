import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogboxComponent } from './dialogbox.component';

describe('DialogboxComponent', () => {
  let component: DialogboxComponent;
  let fixture: ComponentFixture<DialogboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
