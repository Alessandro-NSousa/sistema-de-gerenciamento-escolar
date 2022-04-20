import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMatricula, getMatriculaIdentifier } from '../matricula.model';

export type EntityResponseType = HttpResponse<IMatricula>;
export type EntityArrayResponseType = HttpResponse<IMatricula[]>;

@Injectable({ providedIn: 'root' })
export class MatriculaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/matriculas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(matricula: IMatricula): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(matricula);
    return this.http
      .post<IMatricula>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(matricula: IMatricula): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(matricula);
    return this.http
      .put<IMatricula>(`${this.resourceUrl}/${getMatriculaIdentifier(matricula) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(matricula: IMatricula): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(matricula);
    return this.http
      .patch<IMatricula>(`${this.resourceUrl}/${getMatriculaIdentifier(matricula) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IMatricula>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IMatricula[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addMatriculaToCollectionIfMissing(
    matriculaCollection: IMatricula[],
    ...matriculasToCheck: (IMatricula | null | undefined)[]
  ): IMatricula[] {
    const matriculas: IMatricula[] = matriculasToCheck.filter(isPresent);
    if (matriculas.length > 0) {
      const matriculaCollectionIdentifiers = matriculaCollection.map(matriculaItem => getMatriculaIdentifier(matriculaItem)!);
      const matriculasToAdd = matriculas.filter(matriculaItem => {
        const matriculaIdentifier = getMatriculaIdentifier(matriculaItem);
        if (matriculaIdentifier == null || matriculaCollectionIdentifiers.includes(matriculaIdentifier)) {
          return false;
        }
        matriculaCollectionIdentifiers.push(matriculaIdentifier);
        return true;
      });
      return [...matriculasToAdd, ...matriculaCollection];
    }
    return matriculaCollection;
  }

  protected convertDateFromClient(matricula: IMatricula): IMatricula {
    return Object.assign({}, matricula, {
      ano: matricula.ano?.isValid() ? matricula.ano.format(DATE_FORMAT) : undefined,
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
      res.body.forEach((matricula: IMatricula) => {
        matricula.ano = matricula.ano ? dayjs(matricula.ano) : undefined;
      });
    }
    return res;
  }
}
