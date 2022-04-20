import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITelefone, Telefone } from '../telefone.model';
import { TelefoneService } from '../service/telefone.service';
import { IDiscente } from 'app/entities/discente/discente.model';
import { DiscenteService } from 'app/entities/discente/service/discente.service';
import { IDocente } from 'app/entities/docente/docente.model';
import { DocenteService } from 'app/entities/docente/service/docente.service';

@Component({
  selector: 'jhi-telefone-update',
  templateUrl: './telefone-update.component.html',
})
export class TelefoneUpdateComponent implements OnInit {
  isSaving = false;

  discentesSharedCollection: IDiscente[] = [];
  docentesSharedCollection: IDocente[] = [];

  editForm = this.fb.group({
    id: [],
    numero: [],
    discente: [],
    discente: [],
  });

  constructor(
    protected telefoneService: TelefoneService,
    protected discenteService: DiscenteService,
    protected docenteService: DocenteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ telefone }) => {
      this.updateForm(telefone);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const telefone = this.createFromForm();
    if (telefone.id !== undefined) {
      this.subscribeToSaveResponse(this.telefoneService.update(telefone));
    } else {
      this.subscribeToSaveResponse(this.telefoneService.create(telefone));
    }
  }

  trackDiscenteById(_index: number, item: IDiscente): number {
    return item.id!;
  }

  trackDocenteById(_index: number, item: IDocente): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITelefone>>): void {
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

  protected updateForm(telefone: ITelefone): void {
    this.editForm.patchValue({
      id: telefone.id,
      numero: telefone.numero,
      discente: telefone.discente,
      discente: telefone.discente,
    });

    this.discentesSharedCollection = this.discenteService.addDiscenteToCollectionIfMissing(
      this.discentesSharedCollection,
      telefone.discente
    );
    this.docentesSharedCollection = this.docenteService.addDocenteToCollectionIfMissing(this.docentesSharedCollection, telefone.discente);
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

    this.docenteService
      .query()
      .pipe(map((res: HttpResponse<IDocente[]>) => res.body ?? []))
      .pipe(
        map((docentes: IDocente[]) => this.docenteService.addDocenteToCollectionIfMissing(docentes, this.editForm.get('discente')!.value))
      )
      .subscribe((docentes: IDocente[]) => (this.docentesSharedCollection = docentes));
  }

  protected createFromForm(): ITelefone {
    return {
      ...new Telefone(),
      id: this.editForm.get(['id'])!.value,
      numero: this.editForm.get(['numero'])!.value,
      discente: this.editForm.get(['discente'])!.value,
      discente: this.editForm.get(['discente'])!.value,
    };
  }
}
