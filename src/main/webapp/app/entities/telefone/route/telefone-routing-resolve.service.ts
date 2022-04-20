import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITelefone, Telefone } from '../telefone.model';
import { TelefoneService } from '../service/telefone.service';

@Injectable({ providedIn: 'root' })
export class TelefoneRoutingResolveService implements Resolve<ITelefone> {
  constructor(protected service: TelefoneService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITelefone> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((telefone: HttpResponse<Telefone>) => {
          if (telefone.body) {
            return of(telefone.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Telefone());
  }
}
