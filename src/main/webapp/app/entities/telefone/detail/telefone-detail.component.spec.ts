import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TelefoneDetailComponent } from './telefone-detail.component';

describe('Telefone Management Detail Component', () => {
  let comp: TelefoneDetailComponent;
  let fixture: ComponentFixture<TelefoneDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TelefoneDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ telefone: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(TelefoneDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(TelefoneDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load telefone on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.telefone).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
