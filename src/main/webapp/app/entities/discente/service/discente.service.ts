import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDiscente, getDiscenteIdentifier } from '../discente.model';

export type EntityResponseType = HttpResponse<IDiscente>;
export type EntityArrayResponseType = HttpResponse<IDiscente[]>;

@Injectable({ providedIn: 'root' })
export class DiscenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/discentes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(discente: IDiscente): Observable<EntityResponseType> {
    return this.http.post<IDiscente>(this.resourceUrl, discente, { observe: 'response' });
  }

  update(discente: IDiscente): Observable<EntityResponseType> {
    return this.http.put<IDiscente>(`${this.resourceUrl}/${getDiscenteIdentifier(discente) as number}`, discente, { observe: 'response' });
  }

  partialUpdate(discente: IDiscente): Observable<EntityResponseType> {
    return this.http.patch<IDiscente>(`${this.resourceUrl}/${getDiscenteIdentifier(discente) as number}`, discente, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDiscente>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDiscente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDiscenteToCollectionIfMissing(discenteCollection: IDiscente[], ...discentesToCheck: (IDiscente | null | undefined)[]): IDiscente[] {
    const discentes: IDiscente[] = discentesToCheck.filter(isPresent);
    if (discentes.length > 0) {
      const discenteCollectionIdentifiers = discenteCollection.map(discenteItem => getDiscenteIdentifier(discenteItem)!);
      const discentesToAdd = discentes.filter(discenteItem => {
        const discenteIdentifier = getDiscenteIdentifier(discenteItem);
        if (discenteIdentifier == null || discenteCollectionIdentifiers.includes(discenteIdentifier)) {
          return false;
        }
        discenteCollectionIdentifiers.push(discenteIdentifier);
        return true;
      });
      return [...discentesToAdd, ...discenteCollection];
    }
    return discenteCollection;
  }
}
