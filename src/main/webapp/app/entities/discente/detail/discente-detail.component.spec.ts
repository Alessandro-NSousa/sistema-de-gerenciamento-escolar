import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DiscenteDetailComponent } from './discente-detail.component';

describe('Discente Management Detail Component', () => {
  let comp: DiscenteDetailComponent;
  let fixture: ComponentFixture<DiscenteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiscenteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ discente: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DiscenteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DiscenteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load discente on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.discente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
