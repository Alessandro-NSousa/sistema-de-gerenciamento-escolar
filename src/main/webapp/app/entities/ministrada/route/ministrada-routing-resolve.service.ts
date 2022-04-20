import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMinistrada, Ministrada } from '../ministrada.model';
import { MinistradaService } from '../service/ministrada.service';

@Injectable({ providedIn: 'root' })
export class MinistradaRoutingResolveService implements Resolve<IMinistrada> {
  constructor(protected service: MinistradaService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMinistrada> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((ministrada: HttpResponse<Ministrada>) => {
          if (ministrada.body) {
            return of(ministrada.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Ministrada());
  }
}
