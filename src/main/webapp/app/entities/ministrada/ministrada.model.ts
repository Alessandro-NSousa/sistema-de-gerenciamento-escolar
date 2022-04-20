import dayjs from 'dayjs/esm';
import { IDisciplina } from 'app/entities/disciplina/disciplina.model';
import { IDocente } from 'app/entities/docente/docente.model';

export interface IMinistrada {
  id?: number;
  ano?: dayjs.Dayjs | null;
  ch?: number | null;
  disciplna?: IDisciplina | null;
  docente?: IDocente | null;
}

export class Ministrada implements IMinistrada {
  constructor(
    public id?: number,
    public ano?: dayjs.Dayjs | null,
    public ch?: number | null,
    public disciplna?: IDisciplina | null,
    public docente?: IDocente | null
  ) {}
}

export function getMinistradaIdentifier(ministrada: IMinistrada): number | undefined {
  return ministrada.id;
}
