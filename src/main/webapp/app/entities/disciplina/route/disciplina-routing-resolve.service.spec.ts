import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { IDisciplina, Disciplina } from '../disciplina.model';
import { DisciplinaService } from '../service/disciplina.service';

import { DisciplinaRoutingResolveService } from './disciplina-routing-resolve.service';

describe('Disciplina routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: DisciplinaRoutingResolveService;
  let service: DisciplinaService;
  let resultDisciplina: IDisciplina | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(DisciplinaRoutingResolveService);
    service = TestBed.inject(DisciplinaService);
    resultDisciplina = undefined;
  });

  describe('resolve', () => {
    it('should return IDisciplina returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDisciplina = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDisciplina).toEqual({ id: 123 });
    });

    it('should return new IDisciplina if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDisciplina = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultDisciplina).toEqual(new Disciplina());
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Disciplina })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultDisciplina = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultDisciplina).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
