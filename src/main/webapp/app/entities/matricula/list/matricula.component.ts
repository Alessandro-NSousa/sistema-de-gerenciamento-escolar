import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMatricula } from '../matricula.model';
import { MatriculaService } from '../service/matricula.service';
import { MatriculaDeleteDialogComponent } from '../delete/matricula-delete-dialog.component';

@Component({
  selector: 'jhi-matricula',
  templateUrl: './matricula.component.html',
})
export class MatriculaComponent implements OnInit {
  matriculas?: IMatricula[];
  isLoading = false;

  constructor(protected matriculaService: MatriculaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.matriculaService.query().subscribe({
      next: (res: HttpResponse<IMatricula[]>) => {
        this.isLoading = false;
        this.matriculas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMatricula): number {
    return item.id!;
  }

  delete(matricula: IMatricula): void {
    const modalRef = this.modalService.open(MatriculaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.matricula = matricula;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
