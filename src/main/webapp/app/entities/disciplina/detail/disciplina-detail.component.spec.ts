import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { DisciplinaDetailComponent } from './disciplina-detail.component';

describe('Disciplina Management Detail Component', () => {
  let comp: DisciplinaDetailComponent;
  let fixture: ComponentFixture<DisciplinaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisciplinaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ disciplina: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(DisciplinaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(DisciplinaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load disciplina on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.disciplina).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
