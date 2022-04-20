import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { DiscenteService } from '../service/discente.service';
import { IDiscente, Discente } from '../discente.model';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';

import { DiscenteUpdateComponent } from './discente-update.component';

describe('Discente Management Update Component', () => {
  let comp: DiscenteUpdateComponent;
  let fixture: ComponentFixture<DiscenteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let discenteService: DiscenteService;
  let enderecoService: EnderecoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [DiscenteUpdateComponent],
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
      .overrideTemplate(DiscenteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscenteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    discenteService = TestBed.inject(DiscenteService);
    enderecoService = TestBed.inject(EnderecoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call endereco query and add missing value', () => {
      const discente: IDiscente = { id: 456 };
      const endereco: IEndereco = { id: 827 };
      discente.endereco = endereco;

      const enderecoCollection: IEndereco[] = [{ id: 46789 }];
      jest.spyOn(enderecoService, 'query').mockReturnValue(of(new HttpResponse({ body: enderecoCollection })));
      const expectedCollection: IEndereco[] = [endereco, ...enderecoCollection];
      jest.spyOn(enderecoService, 'addEnderecoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ discente });
      comp.ngOnInit();

      expect(enderecoService.query).toHaveBeenCalled();
      expect(enderecoService.addEnderecoToCollectionIfMissing).toHaveBeenCalledWith(enderecoCollection, endereco);
      expect(comp.enderecosCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const discente: IDiscente = { id: 456 };
      const endereco: IEndereco = { id: 81291 };
      discente.endereco = endereco;

      activatedRoute.data = of({ discente });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(discente));
      expect(comp.enderecosCollection).toContain(endereco);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Discente>>();
      const discente = { id: 123 };
      jest.spyOn(discenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discente }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(discenteService.update).toHaveBeenCalledWith(discente);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Discente>>();
      const discente = new Discente();
      jest.spyOn(discenteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: discente }));
      saveSubject.complete();

      // THEN
      expect(discenteService.create).toHaveBeenCalledWith(discente);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Discente>>();
      const discente = { id: 123 };
      jest.spyOn(discenteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ discente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(discenteService.update).toHaveBeenCalledWith(discente);
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
