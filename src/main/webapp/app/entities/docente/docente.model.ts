import dayjs from 'dayjs/esm';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { Sexo } from 'app/entities/enumerations/sexo.model';

export interface IDocente {
  id?: number;
  nome?: string;
  cpf?: string;
  gerero?: Sexo | null;
  nascimento?: dayjs.Dayjs | null;
  endereco?: IEndereco | null;
}

export class Docente implements IDocente {
  constructor(
    public id?: number,
    public nome?: string,
    public cpf?: string,
    public gerero?: Sexo | null,
    public nascimento?: dayjs.Dayjs | null,
    public endereco?: IEndereco | null
  ) {}
}

export function getDocenteIdentifier(docente: IDocente): number | undefined {
  return docente.id;
}
