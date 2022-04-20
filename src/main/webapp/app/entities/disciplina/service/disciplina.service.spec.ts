import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IDisciplina, Disciplina } from '../disciplina.model';

import { DisciplinaService } from './disciplina.service';

describe('Disciplina Service', () => {
  let service: DisciplinaService;
  let httpMock: HttpTestingController;
  let elemDefault: IDisciplina;
  let expectedResult: IDisciplina | IDisciplina[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(DisciplinaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      nome: 'AAAAAAA',
      dataInicio: currentDate,
      cargaHoraria: 0,
      credito: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          dataInicio: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Disciplina', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          dataInicio: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataInicio: currentDate,
        },
        returnedFromService
      );

      service.create(new Disciplina()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Disciplina', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          dataInicio: currentDate.format(DATE_FORMAT),
          cargaHoraria: 1,
          credito: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataInicio: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Disciplina', () => {
      const patchObject = Object.assign(
        {
          nome: 'BBBBBB',
          dataInicio: currentDate.format(DATE_FORMAT),
        },
        new Disciplina()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          dataInicio: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Disciplina', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          nome: 'BBBBBB',
          dataInicio: currentDate.format(DATE_FORMAT),
          cargaHoraria: 1,
          credito: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          dataInicio: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Disciplina', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addDisciplinaToCollectionIfMissing', () => {
      it('should add a Disciplina to an empty array', () => {
        const disciplina: IDisciplina = { id: 123 };
        expectedResult = service.addDisciplinaToCollectionIfMissing([], disciplina);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(disciplina);
      });

      it('should not add a Disciplina to an array that contains it', () => {
        const disciplina: IDisciplina = { id: 123 };
        const disciplinaCollection: IDisciplina[] = [
          {
            ...disciplina,
          },
          { id: 456 },
        ];
        expectedResult = service.addDisciplinaToCollectionIfMissing(disciplinaCollection, disciplina);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Disciplina to an array that doesn't contain it", () => {
        const disciplina: IDisciplina = { id: 123 };
        const disciplinaCollection: IDisciplina[] = [{ id: 456 }];
        expectedResult = service.addDisciplinaToCollectionIfMissing(disciplinaCollection, disciplina);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(disciplina);
      });

      it('should add only unique Disciplina to an array', () => {
        const disciplinaArray: IDisciplina[] = [{ id: 123 }, { id: 456 }, { id: 56659 }];
        const disciplinaCollection: IDisciplina[] = [{ id: 123 }];
        expectedResult = service.addDisciplinaToCollectionIfMissing(disciplinaCollection, ...disciplinaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const disciplina: IDisciplina = { id: 123 };
        const disciplina2: IDisciplina = { id: 456 };
        expectedResult = service.addDisciplinaToCollectionIfMissing([], disciplina, disciplina2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(disciplina);
        expect(expectedResult).toContain(disciplina2);
      });

      it('should accept null and undefined values', () => {
        const disciplina: IDisciplina = { id: 123 };
        expectedResult = service.addDisciplinaToCollectionIfMissing([], null, disciplina, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(disciplina);
      });

      it('should return initial array if no Disciplina is added', () => {
        const disciplinaCollection: IDisciplina[] = [{ id: 123 }];
        expectedResult = service.addDisciplinaToCollectionIfMissing(disciplinaCollection, undefined, null);
        expect(expectedResult).toEqual(disciplinaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
