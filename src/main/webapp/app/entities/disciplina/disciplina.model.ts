import dayjs from 'dayjs/esm';

export interface IDisciplina {
  id?: number;
  nome?: string;
  dataInicio?: dayjs.Dayjs;
  cargaHoraria?: number;
  credito?: number | null;
}

export class Disciplina implements IDisciplina {
  constructor(
    public id?: number,
    public nome?: string,
    public dataInicio?: dayjs.Dayjs,
    public cargaHoraria?: number,
    public credito?: number | null
  ) {}
}

export function getDisciplinaIdentifier(disciplina: IDisciplina): number | undefined {
  return disciplina.id;
}
