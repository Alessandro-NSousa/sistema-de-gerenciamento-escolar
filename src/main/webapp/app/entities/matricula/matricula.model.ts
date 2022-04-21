import dayjs from 'dayjs/esm';
import { IDiscente } from 'app/entities/discente/discente.model';
import { IDisciplina } from 'app/entities/disciplina/disciplina.model';

export interface IMatricula {
  id?: number;
  ano?: dayjs.Dayjs | null;
  notaFinal?: number | null;
  nFaltas?: number | null;
  discente?: IDiscente | null;
  disciplina?: IDisciplina | null;
}

export class Matricula implements IMatricula {
  constructor(
    public id?: number,
    public ano?: dayjs.Dayjs | null,
    public notaFinal?: number | null,
    public nFaltas?: number | null,
    public discente?: IDiscente | null,
    public disciplina?: IDisciplina | null
  ) {}
}

export function getMatriculaIdentifier(matricula: IMatricula): number | undefined {
  return matricula.id;
}
