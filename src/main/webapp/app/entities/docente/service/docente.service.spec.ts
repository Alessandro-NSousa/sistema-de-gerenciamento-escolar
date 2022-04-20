import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { Sexo } from 'app/entities/enumerations/sexo.model';
import { IDocente, Docente } from '../docente.model';

import { DocenteService } from './docente.service';

describe('Docente Service', () => {
  let service: DocenteService;
  let httpMock: HttpTestingController;
  let elemDefault: IDocente;
  let expectedResult: IDocente | IDocente[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DocenteService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
      cpf: 'AAAAAAA',
      gerero: Sexo.F,
      dataNascimento: currentDate,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dataNascimento: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Docente', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dataNascimento: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataNascimento: currentDate,
        },
        returnedFromService
      );

      service.create(new Docente()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Docente', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          cpf: 'BBBBBB',
          gerero: 'BBBBBB',
          dataNascimento: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataNascimento: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Docente', () => {
      const patchObject = Object.assign(
        {
          nome: 'BBBBBB',
          cpf: 'BBBBBB',
          gerero: 'BBBBBB',
        },
        new Docente()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dataNascimento: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Docente', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          cpf: 'BBBBBB',
          gerero: 'BBBBBB',
          dataNascimento: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataNascimento: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Docente', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDocenteToCollectionIfMissing', () => {
      it('should add a Docente to an empty array', () => {
        const docente: IDocente = { id: 123 };
        expectedResult = service.addDocenteToCollectionIfMissing([], docente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(docente);
      });

      it('should not add a Docente to an array that contains it', () => {
        const docente: IDocente = { id: 123 };
        const docenteCollection: IDocente[] = [
          {
            ...docente,
          },
          { id: 456 },
        ];
        expectedResult = service.addDocenteToCollectionIfMissing(docenteCollection, docente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Docente to an array that doesn't contain it", () => {
        const docente: IDocente = { id: 123 };
        const docenteCollection: IDocente[] = [{ id: 456 }];
        expectedResult = service.addDocenteToCollectionIfMissing(docenteCollection, docente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(docente);
      });

      it('should add only unique Docente to an array', () => {
        const docenteArray: IDocente[] = [{ id: 123 }, { id: 456 }, { id: 2463 }];
        const docenteCollection: IDocente[] = [{ id: 123 }];
        expectedResult = service.addDocenteToCollectionIfMissing(docenteCollection, ...docenteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const docente: IDocente = { id: 123 };
        const docente2: IDocente = { id: 456 };
        expectedResult = service.addDocenteToCollectionIfMissing([], docente, docente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(docente);
        expect(expectedResult).toContain(docente2);
      });

      it('should accept null and undefined values', () => {
        const docente: IDocente = { id: 123 };
        expectedResult = service.addDocenteToCollectionIfMissing([], null, docente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(docente);
      });

      it('should return initial array if no Docente is added', () => {
        const docenteCollection: IDocente[] = [{ id: 123 }];
        expectedResult = service.addDocenteToCollectionIfMissing(docenteCollection, undefined, null);
        expect(expectedResult).toEqual(docenteCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
