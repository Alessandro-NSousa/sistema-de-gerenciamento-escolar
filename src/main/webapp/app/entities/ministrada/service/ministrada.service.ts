import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMinistrada, getMinistradaIdentifier } from '../ministrada.model';

export type EntityResponseType = HttpResponse<IMinistrada>;
export type EntityArrayResponseType = HttpResponse<IMinistrada[]>;

@Injectable({ providedIn: 'root' })
export class MinistradaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ministradas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(ministrada: IMinistrada): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ministrada);
    return this.http
      .post<IMinistrada>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(ministrada: IMinistrada): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ministrada);
    return this.http
      .put<IMinistrada>(`${this.resourceUrl}/${getMinistradaIdentifier(ministrada) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(ministrada: IMinistrada): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(ministrada);
    return this.http
      .patch<IMinistrada>(`${this.resourceUrl}/${getMinistradaIdentifier(ministrada) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMinistrada>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMinistrada[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMinistradaToCollectionIfMissing(
    ministradaCollection: IMinistrada[],
    ...ministradasToCheck: (IMinistrada | null | undefined)[]
  ): IMinistrada[] {
    const ministradas: IMinistrada[] = ministradasToCheck.filter(isPresent);
    if (ministradas.length > 0) {
      const ministradaCollectionIdentifiers = ministradaCollection.map(ministradaItem => getMinistradaIdentifier(ministradaItem)!);
      const ministradasToAdd = ministradas.filter(ministradaItem => {
        const ministradaIdentifier = getMinistradaIdentifier(ministradaItem);
        if (ministradaIdentifier == null || ministradaCollectionIdentifiers.includes(ministradaIdentifier)) {
          return false;
        }
        ministradaCollectionIdentifiers.push(ministradaIdentifier);
        return true;
      });
      return [...ministradasToAdd, ...ministradaCollection];
    }
    return ministradaCollection;
  }

  protected convertDateFromClient(ministrada: IMinistrada): IMinistrada {
    return Object.assign({}, ministrada, {
      ano: ministrada.ano?.isValid() ? ministrada.ano.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.ano = res.body.ano ? dayjs(res.body.ano) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((ministrada: IMinistrada) => {
        ministrada.ano = ministrada.ano ? dayjs(ministrada.ano) : undefined;
      });
    }
    return res;
  }
}
