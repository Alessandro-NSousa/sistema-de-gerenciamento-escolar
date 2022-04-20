import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MinistradaService } from '../service/ministrada.service';
import { IMinistrada, Ministrada } from '../ministrada.model';
import { IDisciplina } from 'app/entities/disciplina/disciplina.model';
import { DisciplinaService } from 'app/entities/disciplina/service/disciplina.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';

import { MinistradaUpdateComponent } from './ministrada-update.component';

describe('Ministrada Management Update Component', () => {
  let comp: MinistradaUpdateComponent;
  let fixture: ComponentFixture<MinistradaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ministradaService: MinistradaService;
  let disciplinaService: DisciplinaService;
  let docenteService: DocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MinistradaUpdateComponent],
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
      .overrideTemplate(MinistradaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MinistradaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ministradaService = TestBed.inject(MinistradaService);
    disciplinaService = TestBed.inject(DisciplinaService);
    docenteService = TestBed.inject(DocenteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Disciplina query and add missing value', () => {
      const ministrada: IMinistrada = { id: 456 };
      const disciplna: IDisciplina = { id: 91752 };
      ministrada.disciplna = disciplna;

      const disciplinaCollection: IDisciplina[] = [{ id: 61604 }];
      jest.spyOn(disciplinaService, 'query').mockReturnValue(of(new HttpResponse({ body: disciplinaCollection })));
      const additionalDisciplinas = [disciplna];
      const expectedCollection: IDisciplina[] = [...additionalDisciplinas, ...disciplinaCollection];
      jest.spyOn(disciplinaService, 'addDisciplinaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ministrada });
      comp.ngOnInit();

      expect(disciplinaService.query).toHaveBeenCalled();
      expect(disciplinaService.addDisciplinaToCollectionIfMissing).toHaveBeenCalledWith(disciplinaCollection, ...additionalDisciplinas);
      expect(comp.disciplinasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Docente query and add missing value', () => {
      const ministrada: IMinistrada = { id: 456 };
      const docente: IDocente = { id: 44398 };
      ministrada.docente = docente;

      const docenteCollection: IDocente[] = [{ id: 35486 }];
      jest.spyOn(docenteService, 'query').mockReturnValue(of(new HttpResponse({ body: docenteCollection })));
      const additionalDocentes = [docente];
      const expectedCollection: IDocente[] = [...additionalDocentes, ...docenteCollection];
      jest.spyOn(docenteService, 'addDocenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ ministrada });
      comp.ngOnInit();

      expect(docenteService.query).toHaveBeenCalled();
      expect(docenteService.addDocenteToCollectionIfMissing).toHaveBeenCalledWith(docenteCollection, ...additionalDocentes);
      expect(comp.docentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const ministrada: IMinistrada = { id: 456 };
      const disciplna: IDisciplina = { id: 99414 };
      ministrada.disciplna = disciplna;
      const docente: IDocente = { id: 66080 };
      ministrada.docente = docente;

      activatedRoute.data = of({ ministrada });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(ministrada));
      expect(comp.disciplinasSharedCollection).toContain(disciplna);
      expect(comp.docentesSharedCollection).toContain(docente);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ministrada>>();
      const ministrada = { id: 123 };
      jest.spyOn(ministradaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ministrada });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ministrada }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(ministradaService.update).toHaveBeenCalledWith(ministrada);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ministrada>>();
      const ministrada = new Ministrada();
      jest.spyOn(ministradaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ministrada });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: ministrada }));
      saveSubject.complete();

      // THEN
      expect(ministradaService.create).toHaveBeenCalledWith(ministrada);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Ministrada>>();
      const ministrada = { id: 123 };
      jest.spyOn(ministradaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ ministrada });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ministradaService.update).toHaveBeenCalledWith(ministrada);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDisciplinaById', () => {
      it('Should return tracked Disciplina primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDisciplinaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDocenteById', () => {
      it('Should return tracked Docente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDocenteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
