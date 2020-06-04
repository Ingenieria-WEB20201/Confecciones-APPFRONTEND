import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCompraComponent } from './update-compra.component';

describe('UpdateCompraComponent', () => {
  let component: UpdateCompraComponent;
  let fixture: ComponentFixture<UpdateCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
