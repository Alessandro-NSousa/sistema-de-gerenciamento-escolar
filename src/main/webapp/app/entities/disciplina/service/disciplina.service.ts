import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDisciplina, getDisciplinaIdentifier } from '../disciplina.model';

export type EntityResponseType = HttpResponse<IDisciplina>;
export type EntityArrayResponseType = HttpResponse<IDisciplina[]>;

@Injectable({ providedIn: 'root' })
export class DisciplinaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/disciplinas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(disciplina: IDisciplina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(disciplina);
    return this.http
      .post<IDisciplina>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(disciplina: IDisciplina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(disciplina);
    return this.http
      .put<IDisciplina>(`${this.resourceUrl}/${getDisciplinaIdentifier(disciplina) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(disciplina: IDisciplina): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(disciplina);
    return this.http
      .patch<IDisciplina>(`${this.resourceUrl}/${getDisciplinaIdentifier(disciplina) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IDisciplina>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IDisciplina[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addDisciplinaToCollectionIfMissing(
    disciplinaCollection: IDisciplina[],
    ...disciplinasToCheck: (IDisciplina | null | undefined)[]
  ): IDisciplina[] {
    const disciplinas: IDisciplina[] = disciplinasToCheck.filter(isPresent);
    if (disciplinas.length > 0) {
      const disciplinaCollectionIdentifiers = disciplinaCollection.map(disciplinaItem => getDisciplinaIdentifier(disciplinaItem)!);
      const disciplinasToAdd = disciplinas.filter(disciplinaItem => {
        const disciplinaIdentifier = getDisciplinaIdentifier(disciplinaItem);
        if (disciplinaIdentifier == null || disciplinaCollectionIdentifiers.includes(disciplinaIdentifier)) {
          return false;
        }
        disciplinaCollectionIdentifiers.push(disciplinaIdentifier);
        return true;
      });
      return [...disciplinasToAdd, ...disciplinaCollection];
    }
    return disciplinaCollection;
  }

  protected convertDateFromClient(disciplina: IDisciplina): IDisciplina {
    return Object.assign({}, disciplina, {
      dataInicio: disciplina.dataInicio?.isValid() ? disciplina.dataInicio.format(DATE_FORMAT) : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dataInicio = res.body.dataInicio ? dayjs(res.body.dataInicio) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((disciplina: IDisciplina) => {
        disciplina.dataInicio = disciplina.dataInicio ? dayjs(disciplina.dataInicio) : undefined;
      });
    }
    return res;
  }
}
