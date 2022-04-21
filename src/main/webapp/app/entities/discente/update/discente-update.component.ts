import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDiscente, Discente } from '../discente.model';
import { DiscenteService } from '../service/discente.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { Sexo } from 'app/entities/enumerations/sexo.model';

@Component({
  selector: 'jhi-discente-update',
  templateUrl: './discente-update.component.html',
})
export class DiscenteUpdateComponent implements OnInit {
  isSaving = false;
  sexoValues = Object.keys(Sexo);

  enderecosCollection: IEndereco[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    matricula: [null, [Validators.required]],
    curso: [null, [Validators.required]],
    genero: [],
    nascimento: [],
    endereco: [],
  });

  constructor(
    protected discenteService: DiscenteService,
    protected enderecoService: EnderecoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discente }) => {
      this.updateForm(discente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const discente = this.createFromForm();
    if (discente.id !== undefined) {
      this.subscribeToSaveResponse(this.discenteService.update(discente));
    } else {
      this.subscribeToSaveResponse(this.discenteService.create(discente));
    }
  }

  trackEnderecoById(_index: number, item: IEndereco): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDiscente>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(discente: IDiscente): void {
    this.editForm.patchValue({
      id: discente.id,
      nome: discente.nome,
      cpf: discente.cpf,
      matricula: discente.matricula,
      curso: discente.curso,
      genero: discente.genero,
      nascimento: discente.nascimento,
      endereco: discente.endereco,
    });

    this.enderecosCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosCollection, discente.endereco);
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query({ filter: 'discente-is-null' })
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosCollection = enderecos));
  }

  protected createFromForm(): IDiscente {
    return {
      ...new Discente(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cpf: this.editForm.get(['cpf'])!.value,
      matricula: this.editForm.get(['matricula'])!.value,
      curso: this.editForm.get(['curso'])!.value,
      genero: this.editForm.get(['genero'])!.value,
      nascimento: this.editForm.get(['nascimento'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
    };
  }
}
