import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DocenteService } from '../service/docente.service';
import { IDocente, Docente } from '../docente.model';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

import { DocenteUpdateComponent } from './docente-update.component';

describe('Docente Management Update Component', () => {
  let comp: DocenteUpdateComponent;
  let fixture: ComponentFixture<DocenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let docenteService: DocenteService;
  let enderecoService: EnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DocenteUpdateComponent],
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
      .overrideTemplate(DocenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DocenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    docenteService = TestBed.inject(DocenteService);
    enderecoService = TestBed.inject(EnderecoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call endereco query and add missing value', () => {
      const docente: IDocente = { id: 456 };
      const endereco: IEndereco = { id: 38623 };
      docente.endereco = endereco;

      const enderecoCollection: IEndereco[] = [{ id: 18925 }];
      jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
      const expectedCollection: IEndereco[] = [endereco, ...enderecoCollection];
      jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(enderecoService.query).toHaveBeenCalled();
      expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(enderecoCollection, endereco);
      expect(comp.enderecosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const docente: IDocente = { id: 456 };
      const endereco: IEndereco = { id: 30930 };
      docente.endereco = endereco;

      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(docente));
      expect(comp.enderecosCollection).toContain(endereco);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = { id: 123 };
      jest.spyOn(docenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docente }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(docenteService.update).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = new Docente();
      jest.spyOn(docenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: docente }));
      saveSubject.complete();

      // THEN
      expect(docenteService.create).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Docente>>();
      const docente = { id: 123 };
      jest.spyOn(docenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ docente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(docenteService.update).toHaveBeenCalledWith(docente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackEnderecoById', () => {
      it('Should return tracked Endereco primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackEnderecoById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
