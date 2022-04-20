import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DisciplinaService } from '../service/disciplina.service';
import { IDisciplina, Disciplina } from '../disciplina.model';

import { DisciplinaUpdateComponent } from './disciplina-update.component';

describe('Disciplina Management Update Component', () => {
  let comp: DisciplinaUpdateComponent;
  let fixture: ComponentFixture<DisciplinaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let disciplinaService: DisciplinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DisciplinaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(DisciplinaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DisciplinaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    disciplinaService = TestBed.inject(DisciplinaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const disciplina: IDisciplina = { id: 456 };

      activatedRoute.data = of({ disciplina });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(disciplina));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Disciplina>>();
      const disciplina = { id: 123 };
      jest.spyOn(disciplinaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ disciplina });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: disciplina }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(disciplinaService.update).toHaveBeenCalledWith(disciplina);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Disciplina>>();
      const disciplina = new Disciplina();
      jest.spyOn(disciplinaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ disciplina });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: disciplina }));
      saveSubject.complete();

      // THEN
      expect(disciplinaService.create).toHaveBeenCalledWith(disciplina);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Disciplina>>();
      const disciplina = { id: 123 };
      jest.spyOn(disciplinaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ disciplina });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(disciplinaService.update).toHaveBeenCalledWith(disciplina);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
