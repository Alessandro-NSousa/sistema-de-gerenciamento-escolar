import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IDocente, Docente } from '../docente.model';
import { DocenteService } from '../service/docente.service';
import { IEndereco } from 'app/entities/endereco/endereco.model';
import { EnderecoService } from 'app/entities/endereco/service/endereco.service';
import { Sexo } from 'app/entities/enumerations/sexo.model';

@Component({
  selector: 'jhi-docente-update',
  templateUrl: './docente-update.component.html',
})
export class DocenteUpdateComponent implements OnInit {
  isSaving = false;
  sexoValues = Object.keys(Sexo);

  enderecosCollection: IEndereco[] = [];

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    cpf: [null, [Validators.required]],
    gerero: [],
    dataNascimento: [],
    endereco: [],
  });

  constructor(
    protected docenteService: DocenteService,
    protected enderecoService: EnderecoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ docente }) => {
      this.updateForm(docente);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const docente = this.createFromForm();
    if (docente.id !== undefined) {
      this.subscribeToSaveResponse(this.docenteService.update(docente));
    } else {
      this.subscribeToSaveResponse(this.docenteService.create(docente));
    }
  }

  trackEnderecoById(_index: number, item: IEndereco): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDocente>>): void {
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

  protected updateForm(docente: IDocente): void {
    this.editForm.patchValue({
      id: docente.id,
      nome: docente.nome,
      cpf: docente.cpf,
      gerero: docente.gerero,
      dataNascimento: docente.dataNascimento,
      endereco: docente.endereco,
    });

    this.enderecosCollection = this.enderecoService.addEnderecoToCollectionIfMissing(this.enderecosCollection, docente.endereco);
  }

  protected loadRelationshipsOptions(): void {
    this.enderecoService
      .query({ filter: 'docente-is-null' })
      .pipe(map((res: HttpResponse<IEndereco[]>) => res.body ?? []))
      .pipe(
        map((enderecos: IEndereco[]) =>
          this.enderecoService.addEnderecoToCollectionIfMissing(enderecos, this.editForm.get('endereco')!.value)
        )
      )
      .subscribe((enderecos: IEndereco[]) => (this.enderecosCollection = enderecos));
  }

  protected createFromForm(): IDocente {
    return {
      ...new Docente(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      cpf: this.editForm.get(['cpf'])!.value,
      gerero: this.editForm.get(['gerero'])!.value,
      dataNascimento: this.editForm.get(['dataNascimento'])!.value,
      endereco: this.editForm.get(['endereco'])!.value,
    };
  }
}
