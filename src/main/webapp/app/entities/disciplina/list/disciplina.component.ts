import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDisciplina } from '../disciplina.model';
import { DisciplinaService } from '../service/disciplina.service';
import { DisciplinaDeleteDialogComponent } from '../delete/disciplina-delete-dialog.component';

@Component({
  selector: 'jhi-disciplina',
  templateUrl: './disciplina.component.html',
})
export class DisciplinaComponent implements OnInit {
  disciplinas?: IDisciplina[];
  isLoading = false;

  constructor(protected disciplinaService: DisciplinaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.disciplinaService.query().subscribe({
      next: (res: HttpResponse<IDisciplina[]>) => {
        this.isLoading = false;
        this.disciplinas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDisciplina): number {
    return item.id!;
  }

  delete(disciplina: IDisciplina): void {
    const modalRef = this.modalService.open(DisciplinaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.disciplina = disciplina;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
