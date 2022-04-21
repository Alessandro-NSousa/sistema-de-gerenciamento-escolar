export interface IEndereco {
  id?: number;
  cep?: string | null;
  logradouro?: string | null;
  complemento?: string | null;
  numero?: number | null;
  cidade?: string | null;
  uf?: string | null;
  bairro?: string | null;
}

export class Endereco implements IEndereco {
  constructor(
    public id?: number,
    public cep?: string | null,
    public logradouro?: string | null,
    public complemento?: string | null,
    public numero?: number | null,
    public cidade?: string | null,
    public uf?: string | null,
    public bairro?: string | null
  ) {}
}

export function getEnderecoIdentifier(endereco: IEndereco): number | undefined {
  return endereco.id;
}
