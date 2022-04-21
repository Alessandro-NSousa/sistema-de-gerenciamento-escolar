import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMatricula, Matricula } from '../matricula.model';
import { MatriculaService } from '../service/matricula.service';
import { IDiscente } from 'app/entities/discente/discente.model';
import { DiscenteService } from 'app/entities/discente/service/discente.service';
import { IDisciplina } from 'app/entities/disciplina/disciplina.model';
import { DisciplinaService } from 'app/entities/disciplina/service/disciplina.service';

@Component({
  selector: 'jhi-matricula-update',
  templateUrl: './matricula-update.component.html',
})
export class MatriculaUpdateComponent implements OnInit {
  isSaving = false;

  discentesSharedCollection: IDiscente[] = [];
  disciplinasSharedCollection: IDisciplina[] = [];

  editForm = this.fb.group({
    id: [],
    ano: [],
    notaFinal: [],
    nFaltas: [],
    discente: [],
    disciplina: [],
  });

  constructor(
    protected matriculaService: MatriculaService,
    protected discenteService: DiscenteService,
    protected disciplinaService: DisciplinaService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ matricula }) => {
      this.updateForm(matricula);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const matricula = this.createFromForm();
    if (matricula.id !== undefined) {
      this.subscribeToSaveResponse(this.matriculaService.update(matricula));
    } else {
      this.subscribeToSaveResponse(this.matriculaService.create(matricula));
    }
  }

  trackDiscenteById(_index: number, item: IDiscente): number {
    return item.id!;
  }

  trackDisciplinaById(_index: number, item: IDisciplina): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMatricula>>): void {
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

  protected updateForm(matricula: IMatricula): void {
    this.editForm.patchValue({
      id: matricula.id,
      ano: matricula.ano,
      notaFinal: matricula.notaFinal,
      nFaltas: matricula.nFaltas,
      discente: matricula.discente,
      disciplina: matricula.disciplina,
    });

    this.discentesSharedCollection = this.discenteService.addDiscenteToCollectionIfMissing(
      this.discentesSharedCollection,
      matricula.discente
    );
    this.disciplinasSharedCollection = this.disciplinaService.addDisciplinaToCollectionIfMissing(
      this.disciplinasSharedCollection,
      matricula.disciplina
    );
  }

  protected loadRelationshipsOptions(): void {
    this.discenteService
      .query()
      .pipe(map((res: HttpResponse<IDiscente[]>) => res.body ?? []))
      .pipe(
        map((discentes: IDiscente[]) =>
          this.discenteService.addDiscenteToCollectionIfMissing(discentes, this.editForm.get('discente')!.value)
        )
      )
      .subscribe((discentes: IDiscente[]) => (this.discentesSharedCollection = discentes));

    this.disciplinaService
      .query()
      .pipe(map((res: HttpResponse<IDisciplina[]>) => res.body ?? []))
      .pipe(
        map((disciplinas: IDisciplina[]) =>
          this.disciplinaService.addDisciplinaToCollectionIfMissing(disciplinas, this.editForm.get('disciplina')!.value)
        )
      )
      .subscribe((disciplinas: IDisciplina[]) => (this.disciplinasSharedCollection = disciplinas));
  }

  protected createFromForm(): IMatricula {
    return {
      ...new Matricula(),
      id: this.editForm.get(['id'])!.value,
      ano: this.editForm.get(['ano'])!.value,
      notaFinal: this.editForm.get(['notaFinal'])!.value,
      nFaltas: this.editForm.get(['nFaltas'])!.value,
      discente: this.editForm.get(['discente'])!.value,
      disciplina: this.editForm.get(['disciplina'])!.value,
    };
  }
}
