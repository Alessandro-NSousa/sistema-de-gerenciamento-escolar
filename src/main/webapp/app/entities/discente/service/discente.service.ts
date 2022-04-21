import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
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
    const copy = this.convertDateFromClient(discente);
    return this.http
      .post<IDiscente>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(discente: IDiscente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discente);
    return this.http
      .put<IDiscente>(`${this.resourceUrl}/${getDiscenteIdentifier(discente) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(discente: IDiscente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(discente);
    return this.http
      .patch<IDiscente>(`${this.resourceUrl}/${getDiscenteIdentifier(discente) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDiscente>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDiscente[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
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

  protected convertDateFromClient(discente: IDiscente): IDiscente {
    return Object.assign({}, discente, {
      nascimento: discente.nascimento?.isValid() ? discente.nascimento.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.nascimento = res.body.nascimento ? dayjs(res.body.nascimento) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((discente: IDiscente) => {
        discente.nascimento = discente.nascimento ? dayjs(discente.nascimento) : undefined;
      });
    }
    return res;
  }
}
