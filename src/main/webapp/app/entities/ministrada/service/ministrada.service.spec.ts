import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import dayjs from 'dayjs/esm';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IMinistrada, Ministrada } from '../ministrada.model';

import { MinistradaService } from './ministrada.service';

describe('Ministrada Service', () => {
  let service: MinistradaService;
  let httpMock: HttpTestingController;
  let elemDefault: IMinistrada;
  let expectedResult: IMinistrada | IMinistrada[] | boolean | null;
  let currentDate: dayjs.Dayjs;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(MinistradaService);
    httpMock = TestBed.inject(HttpTestingController);
    currentDate = dayjs();

    elemDefault = {
      id: 0,
      ano: currentDate,
      ch: 0,
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

    it('should create a Ministrada', () => {
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

      service.create(new Ministrada()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Ministrada', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ano: currentDate.format(DATE_FORMAT),
          ch: 1,
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

    it('should partial update a Ministrada', () => {
      const patchObject = Object.assign(
        {
          ch: 1,
        },
        new Ministrada()
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

    it('should return a list of Ministrada', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          ano: currentDate.format(DATE_FORMAT),
          ch: 1,
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

    it('should delete a Ministrada', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addMinistradaToCollectionIfMissing', () => {
      it('should add a Ministrada to an empty array', () => {
        const ministrada: IMinistrada = { id: 123 };
        expectedResult = service.addMinistradaToCollectionIfMissing([], ministrada);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ministrada);
      });

      it('should not add a Ministrada to an array that contains it', () => {
        const ministrada: IMinistrada = { id: 123 };
        const ministradaCollection: IMinistrada[] = [
          {
            ...ministrada,
          },
          { id: 456 },
        ];
        expectedResult = service.addMinistradaToCollectionIfMissing(ministradaCollection, ministrada);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Ministrada to an array that doesn't contain it", () => {
        const ministrada: IMinistrada = { id: 123 };
        const ministradaCollection: IMinistrada[] = [{ id: 456 }];
        expectedResult = service.addMinistradaToCollectionIfMissing(ministradaCollection, ministrada);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ministrada);
      });

      it('should add only unique Ministrada to an array', () => {
        const ministradaArray: IMinistrada[] = [{ id: 123 }, { id: 456 }, { id: 37761 }];
        const ministradaCollection: IMinistrada[] = [{ id: 123 }];
        expectedResult = service.addMinistradaToCollectionIfMissing(ministradaCollection, ...ministradaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const ministrada: IMinistrada = { id: 123 };
        const ministrada2: IMinistrada = { id: 456 };
        expectedResult = service.addMinistradaToCollectionIfMissing([], ministrada, ministrada2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(ministrada);
        expect(expectedResult).toContain(ministrada2);
      });

      it('should accept null and undefined values', () => {
        const ministrada: IMinistrada = { id: 123 };
        expectedResult = service.addMinistradaToCollectionIfMissing([], null, ministrada, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(ministrada);
      });

      it('should return initial array if no Ministrada is added', () => {
        const ministradaCollection: IMinistrada[] = [{ id: 123 }];
        expectedResult = service.addMinistradaToCollectionIfMissing(ministradaCollection, undefined, null);
        expect(expectedResult).toEqual(ministradaCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
