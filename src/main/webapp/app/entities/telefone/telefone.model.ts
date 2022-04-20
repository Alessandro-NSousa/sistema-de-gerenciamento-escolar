import { IDiscente } from 'app/entities/discente/discente.model';
import { IDocente } from 'app/entities/docente/docente.model';

export interface ITelefone {
  id?: number;
  numero?: string | null;
  discente?: IDiscente | null;
  docente?: IDocente | null;
}

export class Telefone implements ITelefone {
  constructor(public id?: number, public numero?: string | null, public discente?: IDiscente | null, public docente?: IDocente | null) {}
}

export function getTelefoneIdentifier(telefone: ITelefone): number | undefined {
  return telefone.id;
}
