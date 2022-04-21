import dayjs from 'dayjs/esm';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { Sexo } from 'app/entities/enumerations/sexo.model';

export interface IDiscente {
  id?: number;
  nome?: string;
  cpf?: string;
  matricula?: string;
  curso?: string;
  genero?: Sexo | null;
  nascimento?: dayjs.Dayjs | null;
  endereco?: IEndereco | null;
}

export class Discente implements IDiscente {
  constructor(
    public id?: number,
    public nome?: string,
    public cpf?: string,
    public matricula?: string,
    public curso?: string,
    public genero?: Sexo | null,
    public nascimento?: dayjs.Dayjs | null,
    public endereco?: IEndereco | null
  ) {}
}

export function getDiscenteIdentifier(discente: IDiscente): number | undefined {
  return discente.id;
}
