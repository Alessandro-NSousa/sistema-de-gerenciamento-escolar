import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IDisciplina, Disciplina } from '../disciplina.model';
import { DisciplinaService } from '../service/disciplina.service';

@Component({
  selector: 'jhi-disciplina-update',
  templateUrl: './disciplina-update.component.html',
})
export class DisciplinaUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    nome: [null, [Validators.required]],
    dataInicio: [null, [Validators.required]],
    cargaHoraria: [null, [Validators.required]],
    credito: [],
  });

  constructor(protected disciplinaService: DisciplinaService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ disciplina }) => {
      this.updateForm(disciplina);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const disciplina = this.createFromForm();
    if (disciplina.id !== undefined) {
      this.subscribeToSaveResponse(this.disciplinaService.update(disciplina));
    } else {
      this.subscribeToSaveResponse(this.disciplinaService.create(disciplina));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDisciplina>>): void {
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

  protected updateForm(disciplina: IDisciplina): void {
    this.editForm.patchValue({
      id: disciplina.id,
      nome: disciplina.nome,
      dataInicio: disciplina.dataInicio,
      cargaHoraria: disciplina.cargaHoraria,
      credito: disciplina.credito,
    });
  }

  protected createFromForm(): IDisciplina {
    return {
      ...new Disciplina(),
      id: this.editForm.get(['id'])!.value,
      nome: this.editForm.get(['nome'])!.value,
      dataInicio: this.editForm.get(['dataInicio'])!.value,
      cargaHoraria: this.editForm.get(['cargaHoraria'])!.value,
      credito: this.editForm.get(['credito'])!.value,
    };
  }
}
