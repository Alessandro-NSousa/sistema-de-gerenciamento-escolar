import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDocente, getDocenteIdentifier } from '../docente.model';

export type EntityResponseType = HttpResponse<IDocente>;
export type EntityArrayResponseType = HttpResponse<IDocente[]>;

@Injectable({ providedIn: 'root' })
export class DocenteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/docentes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(docente: IDocente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(docente);
    return this.http
      .post<IDocente>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(docente: IDocente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(docente);
    return this.http
      .put<IDocente>(`${this.resourceUrl}/${getDocenteIdentifier(docente) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(docente: IDocente): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(docente);
    return this.http
      .patch<IDocente>(`${this.resourceUrl}/${getDocenteIdentifier(docente) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDocente>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDocente[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDocenteToCollectionIfMissing(docenteCollection: IDocente[], ...docentesToCheck: (IDocente | null | undefined)[]): IDocente[] {
    const docentes: IDocente[] = docentesToCheck.filter(isPresent);
    if (docentes.length > 0) {
      const docenteCollectionIdentifiers = docenteCollection.map(docenteItem => getDocenteIdentifier(docenteItem)!);
      const docentesToAdd = docentes.filter(docenteItem => {
        const docenteIdentifier = getDocenteIdentifier(docenteItem);
        if (docenteIdentifier == null || docenteCollectionIdentifiers.includes(docenteIdentifier)) {
          return false;
        }
        docenteCollectionIdentifiers.push(docenteIdentifier);
        return true;
      });
      return [...docentesToAdd, ...docenteCollection];
    }
    return docenteCollection;
  }

  protected convertDateFromClient(docente: IDocente): IDocente {
    return Object.assign({}, docente, {
      nascimento: docente.nascimento?.isValid() ? docente.nascimento.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((docente: IDocente) => {
        docente.nascimento = docente.nascimento ? dayjs(docente.nascimento) : undefined;
      });
    }
    return res;
  }
}
