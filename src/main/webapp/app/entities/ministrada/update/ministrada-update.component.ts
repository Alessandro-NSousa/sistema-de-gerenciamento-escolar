import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IMinistrada, Ministrada } from '../ministrada.model';
import { MinistradaService } from '../service/ministrada.service';
import { IDisciplina } from 'app/entities/disciplina/disciplina.model';
import { DisciplinaService } from 'app/entities/disciplina/service/disciplina.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';

@Component({
  selector: 'jhi-ministrada-update',
  templateUrl: './ministrada-update.component.html',
})
export class MinistradaUpdateComponent implements OnInit {
  isSaving = false;

  disciplinasSharedCollection: IDisciplina[] = [];
  docentesSharedCollection: IDocente[] = [];

  editForm = this.fb.group({
    id: [],
    ano: [],
    ch: [],
    disciplina: [],
    docente: [],
  });

  constructor(
    protected ministradaService: MinistradaService,
    protected disciplinaService: DisciplinaService,
    protected docenteService: DocenteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ministrada }) => {
      this.updateForm(ministrada);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const ministrada = this.createFromForm();
    if (ministrada.id !== undefined) {
      this.subscribeToSaveResponse(this.ministradaService.update(ministrada));
    } else {
      this.subscribeToSaveResponse(this.ministradaService.create(ministrada));
    }
  }

  trackDisciplinaById(_index: number, item: IDisciplina): number {
    return item.id!;
  }

  trackDocenteById(_index: number, item: IDocente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IMinistrada>>): void {
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

  protected updateForm(ministrada: IMinistrada): void {
    this.editForm.patchValue({
      id: ministrada.id,
      ano: ministrada.ano,
      ch: ministrada.ch,
      disciplina: ministrada.disciplina,
      docente: ministrada.docente,
    });

    this.disciplinasSharedCollection = this.disciplinaService.addDisciplinaToCollectionIfMissing(
      this.disciplinasSharedCollection,
      ministrada.disciplina
    );
    this.docentesSharedCollection = this.docenteService.addDocenteToCollectionIfMissing(this.docentesSharedCollection, ministrada.docente);
  }

  protected loadRelationshipsOptions(): void {
    this.disciplinaService
      .query()
      .pipe(map((res: HttpResponse<IDisciplina[]>) => res.body ?? []))
      .pipe(
        map((disciplinas: IDisciplina[]) =>
          this.disciplinaService.addDisciplinaToCollectionIfMissing(disciplinas, this.editForm.get('disciplina')!.value)
        )
      )
      .subscribe((disciplinas: IDisciplina[]) => (this.disciplinasSharedCollection = disciplinas));

    this.docenteService
      .query()
      .pipe(map((res: HttpResponse<IDocente[]>) => res.body ?? []))
      .pipe(
        map((docentes: IDocente[]) => this.docenteService.addDocenteToCollectionIfMissing(docentes, this.editForm.get('docente')!.value))
      )
      .subscribe((docentes: IDocente[]) => (this.docentesSharedCollection = docentes));
  }

  protected createFromForm(): IMinistrada {
    return {
      ...new Ministrada(),
      id: this.editForm.get(['id'])!.value,
      ano: this.editForm.get(['ano'])!.value,
      ch: this.editForm.get(['ch'])!.value,
      disciplina: this.editForm.get(['disciplina'])!.value,
      docente: this.editForm.get(['docente'])!.value,
    };
  }
}
