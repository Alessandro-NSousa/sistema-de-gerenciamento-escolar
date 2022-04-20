import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITelefone, Telefone } from '../telefone.model';

import { TelefoneService } from './telefone.service';

describe('Telefone Service', () => {
  let service: TelefoneService;
  let httpMock: HttpTestingController;
  let elemDefault: ITelefone;
  let expectedResult: ITelefone | ITelefone[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(TelefoneService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
      numero: 'AAAAAAA',
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

    it('should create a Telefone', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Telefone()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Telefone', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numero: 'BBBBBB',
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Telefone', () => {
      const patchObject = Object.assign(
        {
          numero: 'BBBBBB',
        },
        new Telefone()
      );

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Telefone', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
          numero: 'BBBBBB',
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

    it('should delete a Telefone', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addTelefoneToCollectionIfMissing', () => {
      it('should add a Telefone to an empty array', () => {
        const telefone: ITelefone = { id: 123 };
        expectedResult = service.addTelefoneToCollectionIfMissing([], telefone);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(telefone);
      });

      it('should not add a Telefone to an array that contains it', () => {
        const telefone: ITelefone = { id: 123 };
        const telefoneCollection: ITelefone[] = [
          {
            ...telefone,
          },
          { id: 456 },
        ];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, telefone);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Telefone to an array that doesn't contain it", () => {
        const telefone: ITelefone = { id: 123 };
        const telefoneCollection: ITelefone[] = [{ id: 456 }];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, telefone);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(telefone);
      });

      it('should add only unique Telefone to an array', () => {
        const telefoneArray: ITelefone[] = [{ id: 123 }, { id: 456 }, { id: 56970 }];
        const telefoneCollection: ITelefone[] = [{ id: 123 }];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, ...telefoneArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const telefone: ITelefone = { id: 123 };
        const telefone2: ITelefone = { id: 456 };
        expectedResult = service.addTelefoneToCollectionIfMissing([], telefone, telefone2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(telefone);
        expect(expectedResult).toContain(telefone2);
      });

      it('should accept null and undefined values', () => {
        const telefone: ITelefone = { id: 123 };
        expectedResult = service.addTelefoneToCollectionIfMissing([], null, telefone, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(telefone);
      });

      it('should return initial array if no Telefone is added', () => {
        const telefoneCollection: ITelefone[] = [{ id: 123 }];
        expectedResult = service.addTelefoneToCollectionIfMissing(telefoneCollection, undefined, null);
        expect(expectedResult).toEqual(telefoneCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
