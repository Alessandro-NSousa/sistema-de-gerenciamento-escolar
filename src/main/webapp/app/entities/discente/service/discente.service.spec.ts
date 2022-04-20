import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Sexo } from 'app/entities/enumerations/sexo.model';
import { IDiscente, Discente } from '../discente.model';

import { DiscenteService } from './discente.service';

describe('Discente Service', () => {
  let service: DiscenteService;
  let httpMock: HttpTestingController;
  let elemDefault: IDiscente;
  let expectedResult: IDiscente | IDiscente[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DiscenteService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
      cpf: 'AAAAAAA',
      matricula: 0,
      curso: 'AAAAAAA',
      genero: Sexo.F,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Discente', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Discente()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Discente', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          cpf: 'BBBBBB',
          matricula: 1,
          curso: 'BBBBBB',
          genero: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Discente', () => {
      const patchObject = Object.assign(
        {
          cpf: 'BBBBBB',
          curso: 'BBBBBB',
          genero: 'BBBBBB',
        },
        new Discente()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Discente', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          cpf: 'BBBBBB',
          matricula: 1,
          curso: 'BBBBBB',
          genero: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Discente', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDiscenteToCollectionIfMissing', () => {
      it('should add a Discente to an empty array', () => {
        const discente: IDiscente = { id: 123 };
        expectedResult = service.addDiscenteToCollectionIfMissing([], discente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discente);
      });

      it('should not add a Discente to an array that contains it', () => {
        const discente: IDiscente = { id: 123 };
        const discenteCollection: IDiscente[] = [
          {
            ...discente,
          },
          { id: 456 },
        ];
        expectedResult = service.addDiscenteToCollectionIfMissing(discenteCollection, discente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Discente to an array that doesn't contain it", () => {
        const discente: IDiscente = { id: 123 };
        const discenteCollection: IDiscente[] = [{ id: 456 }];
        expectedResult = service.addDiscenteToCollectionIfMissing(discenteCollection, discente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discente);
      });

      it('should add only unique Discente to an array', () => {
        const discenteArray: IDiscente[] = [{ id: 123 }, { id: 456 }, { id: 12749 }];
        const discenteCollection: IDiscente[] = [{ id: 123 }];
        expectedResult = service.addDiscenteToCollectionIfMissing(discenteCollection, ...discenteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const discente: IDiscente = { id: 123 };
        const discente2: IDiscente = { id: 456 };
        expectedResult = service.addDiscenteToCollectionIfMissing([], discente, discente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(discente);
        expect(expectedResult).toContain(discente2);
      });

      it('should accept null and undefined values', () => {
        const discente: IDiscente = { id: 123 };
        expectedResult = service.addDiscenteToCollectionIfMissing([], null, discente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(discente);
      });

      it('should return initial array if no Discente is added', () => {
        const discenteCollection: IDiscente[] = [{ id: 123 }];
        expectedResult = service.addDiscenteToCollectionIfMissing(discenteCollection, undefined, null);
        expect(expectedResult).toEqual(discenteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
