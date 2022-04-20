import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { TelefoneService } from '../service/telefone.service';
import { ITelefone, Telefone } from '../telefone.model';
import { IDiscente } from 'app/entities/discente/discente.model';
import { DiscenteService } from 'app/entities/discente/service/discente.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';

import { TelefoneUpdateComponent } from './telefone-update.component';

describe('Telefone Management Update Component', () => {
  let comp: TelefoneUpdateComponent;
  let fixture: ComponentFixture<TelefoneUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let telefoneService: TelefoneService;
  let discenteService: DiscenteService;
  let docenteService: DocenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [TelefoneUpdateComponent],
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
      .overrideTemplate(TelefoneUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TelefoneUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    telefoneService = TestBed.inject(TelefoneService);
    discenteService = TestBed.inject(DiscenteService);
    docenteService = TestBed.inject(DocenteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Discente query and add missing value', () => {
      const telefone: ITelefone = { id: 456 };
      const discente: IDiscente = { id: 99831 };
      telefone.discente = discente;

      const discenteCollection: IDiscente[] = [{ id: 92561 }];
      jest.spyOn(discenteService, 'query').mockReturnValue(of(new HttpResponse({ body: discenteCollection })));
      const additionalDiscentes = [discente];
      const expectedCollection: IDiscente[] = [...additionalDiscentes, ...discenteCollection];
      jest.spyOn(discenteService, 'addDiscenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      expect(discenteService.query).toHaveBeenCalled();
      expect(discenteService.addDiscenteToCollectionIfMissing).toHaveBeenCalledWith(discenteCollection, ...additionalDiscentes);
      expect(comp.discentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Docente query and add missing value', () => {
      const telefone: ITelefone = { id: 456 };
      const docente: IDocente = { id: 15809 };
      telefone.docente = docente;

      const docenteCollection: IDocente[] = [{ id: 31329 }];
      jest.spyOn(docenteService, 'query').mockReturnValue(of(new HttpResponse({ body: docenteCollection })));
      const additionalDocentes = [docente];
      const expectedCollection: IDocente[] = [...additionalDocentes, ...docenteCollection];
      jest.spyOn(docenteService, 'addDocenteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      expect(docenteService.query).toHaveBeenCalled();
      expect(docenteService.addDocenteToCollectionIfMissing).toHaveBeenCalledWith(docenteCollection, ...additionalDocentes);
      expect(comp.docentesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const telefone: ITelefone = { id: 456 };
      const discente: IDiscente = { id: 96805 };
      telefone.discente = discente;
      const docente: IDocente = { id: 46785 };
      telefone.docente = docente;

      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(telefone));
      expect(comp.discentesSharedCollection).toContain(discente);
      expect(comp.docentesSharedCollection).toContain(docente);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Telefone>>();
      const telefone = { id: 123 };
      jest.spyOn(telefoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: telefone }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(telefoneService.update).toHaveBeenCalledWith(telefone);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Telefone>>();
      const telefone = new Telefone();
      jest.spyOn(telefoneService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: telefone }));
      saveSubject.complete();

      // THEN
      expect(telefoneService.create).toHaveBeenCalledWith(telefone);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Telefone>>();
      const telefone = { id: 123 };
      jest.spyOn(telefoneService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ telefone });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(telefoneService.update).toHaveBeenCalledWith(telefone);
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

    describe('trackDocenteById', () => {
      it('Should return tracked Docente primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackDocenteById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
