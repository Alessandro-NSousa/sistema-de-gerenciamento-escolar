import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiscente } from '../discente.model';
import { DiscenteService } from '../service/discente.service';
import { DiscenteDeleteDialogComponent } from '../delete/discente-delete-dialog.component';

@Component({
  selector: 'jhi-discente',
  templateUrl: './discente.component.html',
})
export class DiscenteComponent implements OnInit {
  discentes?: IDiscente[];
  isLoading = false;

  constructor(protected discenteService: DiscenteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.discenteService.query().subscribe({
      next: (res: HttpResponse<IDiscente[]>) => {
        this.isLoading = false;
        this.discentes = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IDiscente): number {
    return item.id!;
  }

  delete(discente: IDiscente): void {
    const modalRef = this.modalService.open(DiscenteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.discente = discente;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
