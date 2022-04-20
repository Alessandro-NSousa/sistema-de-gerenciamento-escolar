import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDisciplina, Disciplina } from '../disciplina.model';
import { DisciplinaService } from '../service/disciplina.service';

@Injectable({ providedIn: 'root' })
export class DisciplinaRoutingResolveService implements Resolve<IDisciplina> {
  constructor(protected service: DisciplinaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IDisciplina> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((disciplina: HttpResponse<Disciplina>) => {
          if (disciplina.body) {
            return of(disciplina.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Disciplina());
  }
}
