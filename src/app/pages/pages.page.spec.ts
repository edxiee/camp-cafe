import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagesPage } from './pages.page';

describe('PagesPage', () => {
  let component: PagesPage;
  let fixture: ComponentFixture<PagesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
