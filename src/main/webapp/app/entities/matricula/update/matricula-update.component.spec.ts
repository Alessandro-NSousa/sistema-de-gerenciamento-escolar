import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { MatriculaService } from '../service/matricula.service';
import { IMatricula, Matricula } from '../matricula.model';
import { IDiscente } from 'app/entities/discente/discente.model';
import { DiscenteService } from 'app/entities/discente/service/discente.service';
import { IDisciplina } from 'app/entities/disciplina/disciplina.model';
import { DisciplinaService } from 'app/entities/disciplina/service/disciplina.service';

import { MatriculaUpdateComponent } from './matricula-update.component';

describe('Matricula Management Update Component', () => {
  let comp: MatriculaUpdateComponent;
  let fixture: ComponentFixture<MatriculaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let matriculaService: MatriculaService;
  let discenteService: DiscenteService;
  let disciplinaService: DisciplinaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [MatriculaUpdateComponent],
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
      .overrideTemplate(MatriculaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatriculaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    matriculaService = TestBed.inject(MatriculaService);
    discenteService = TestBed.inject(DiscenteService);
    disciplinaService = TestBed.inject(DisciplinaService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Discente query and add missing value', () => {
      const matricula: IMatricula = { id: 456 };
      const discente: IDiscente = { id: 69826 };
      matricula.discente = discente;

      const discenteCollection: IDiscente[] = [{ id: 65565 }];
      jest.spyOn(discenteService, 'query').mockReturnValue(of(new HttpResponse({ body: discenteCollection })));
      const additionalDiscentes = [discente];
      const expectedCollection: IDiscente[] = [...additionalDiscentes, ...discenteCollection];
      jest.spyOn(discenteService, 'addDiscenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ matricula });
      comp.ngOnInit();

      expect(discenteService.query).toHaveBeenCalled();
      expect(discenteService.addDiscenteToCollectionIfMissing).toHaveBeenCalledWith(discenteCollection, ...additionalDiscentes);
      expect(comp.discentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Disciplina query and add missing value', () => {
      const matricula: IMatricula = { id: 456 };
      const disciplna: IDisciplina = { id: 43567 };
      matricula.disciplna = disciplna;

      const disciplinaCollection: IDisciplina[] = [{ id: 86727 }];
      jest.spyOn(disciplinaService, 'query').mockReturnValue(of(new HttpResponse({ body: disciplinaCollection })));
      const additionalDisciplinas = [disciplna];
      const expectedCollection: IDisciplina[] = [...additionalDisciplinas, ...disciplinaCollection];
      jest.spyOn(disciplinaService, 'addDisciplinaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ matricula });
      comp.ngOnInit();

      expect(disciplinaService.query).toHaveBeenCalled();
      expect(disciplinaService.addDisciplinaToCollectionIfMissing).toHaveBeenCalledWith(disciplinaCollection, ...additionalDisciplinas);
      expect(comp.disciplinasSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const matricula: IMatricula = { id: 456 };
      const discente: IDiscente = { id: 89191 };
      matricula.discente = discente;
      const disciplna: IDisciplina = { id: 46024 };
      matricula.disciplna = disciplna;

      activatedRoute.data = of({ matricula });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(matricula));
      expect(comp.discentesSharedCollection).toContain(discente);
      expect(comp.disciplinasSharedCollection).toContain(disciplna);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Matricula>>();
      const matricula = { id: 123 };
      jest.spyOn(matriculaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matricula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: matricula }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(matriculaService.update).toHaveBeenCalledWith(matricula);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Matricula>>();
      const matricula = new Matricula();
      jest.spyOn(matriculaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matricula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: matricula }));
      saveSubject.complete();

      // THEN
      expect(matriculaService.create).toHaveBeenCalledWith(matricula);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Matricula>>();
      const matricula = { id: 123 };
      jest.spyOn(matriculaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ matricula });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(matriculaService.update).toHaveBeenCalledWith(matricula);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackDiscenteById', () => {
      it('Should return tracked Discente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDiscenteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackDisciplinaById', () => {
      it('Should return tracked Disciplina primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDisciplinaById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
