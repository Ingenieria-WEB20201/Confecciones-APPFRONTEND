import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCompraComponent } from './board-compra.component';

describe('BoardCompraComponent', () => {
  let component: BoardCompraComponent;
  let fixture: ComponentFixture<BoardCompraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardCompraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
