import { IEndereco } from 'app/entities/endereco/endereco.model';
import { Sexo } from 'app/entities/enumerations/sexo.model';

export interface IDiscente {
  id?: number;
  nome?: string;
  cpf?: string;
  matricula?: number;
  curso?: string;
  genero?: Sexo | null;
  endereco?: IEndereco | null;
}

export class Discente implements IDiscente {
  constructor(
    public id?: number,
    public nome?: string,
    public cpf?: string,
    public matricula?: number,
    public curso?: string,
    public genero?: Sexo | null,
    public endereco?: IEndereco | null
  ) {}
}

export function getDiscenteIdentifier(discente: IDiscente): number | undefined {
  return discente.id;
}
