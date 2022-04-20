import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMatricula, Matricula } from '../matricula.model';

import { MatriculaService } from './matricula.service';

describe('Matricula Service', () => {
  let service: MatriculaService;
  let httpMock: HttpTestingController;
  let elemDefault: IMatricula;
  let expectedResult: IMatricula | IMatricula[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MatriculaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      ano: currentDate,
      notaFinal: 0,
      nFaltas: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign(
        {
          ano: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Matricula', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
          ano: currentDate.format(DATE_FORMAT),
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.create(new Matricula()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Matricula', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ano: currentDate.format(DATE_FORMAT),
          notaFinal: 1,
          nFaltas: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Matricula', () => {
      const patchObject = Object.assign(
        {
          ano: currentDate.format(DATE_FORMAT),
          notaFinal: 1,
          nFaltas: 1,
        },
        new Matricula()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Matricula', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ano: currentDate.format(DATE_FORMAT),
          notaFinal: 1,
          nFaltas: 1,
        },
        elemDefault
      );

      const expected = Object.assign(
        {
          ano: currentDate,
        },
        returnedFromService
      );

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Matricula', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMatriculaToCollectionIfMissing', () => {
      it('should add a Matricula to an empty array', () => {
        const matricula: IMatricula = { id: 123 };
        expectedResult = service.addMatriculaToCollectionIfMissing([], matricula);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(matricula);
      });

      it('should not add a Matricula to an array that contains it', () => {
        const matricula: IMatricula = { id: 123 };
        const matriculaCollection: IMatricula[] = [
          {
            ...matricula,
          },
          { id: 456 },
        ];
        expectedResult = service.addMatriculaToCollectionIfMissing(matriculaCollection, matricula);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Matricula to an array that doesn't contain it", () => {
        const matricula: IMatricula = { id: 123 };
        const matriculaCollection: IMatricula[] = [{ id: 456 }];
        expectedResult = service.addMatriculaToCollectionIfMissing(matriculaCollection, matricula);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(matricula);
      });

      it('should add only unique Matricula to an array', () => {
        const matriculaArray: IMatricula[] = [{ id: 123 }, { id: 456 }, { id: 78873 }];
        const matriculaCollection: IMatricula[] = [{ id: 123 }];
        expectedResult = service.addMatriculaToCollectionIfMissing(matriculaCollection, ...matriculaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const matricula: IMatricula = { id: 123 };
        const matricula2: IMatricula = { id: 456 };
        expectedResult = service.addMatriculaToCollectionIfMissing([], matricula, matricula2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(matricula);
        expect(expectedResult).toContain(matricula2);
      });

      it('should accept null and undefined values', () => {
        const matricula: IMatricula = { id: 123 };
        expectedResult = service.addMatriculaToCollectionIfMissing([], null, matricula, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(matricula);
      });

      it('should return initial array if no Matricula is added', () => {
        const matriculaCollection: IMatricula[] = [{ id: 123 }];
        expectedResult = service.addMatriculaToCollectionIfMissing(matriculaCollection, undefined, null);
        expect(expectedResult).toEqual(matriculaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
