import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IMinistrada } from '../ministrada.model';
import { MinistradaService } from '../service/ministrada.service';
import { MinistradaDeleteDialogComponent } from '../delete/ministrada-delete-dialog.component';

@Component({
  selector: 'jhi-ministrada',
  templateUrl: './ministrada.component.html',
})
export class MinistradaComponent implements OnInit {
  ministradas?: IMinistrada[];
  isLoading = false;

  constructor(protected ministradaService: MinistradaService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.ministradaService.query().subscribe({
      next: (res: HttpResponse<IMinistrada[]>) => {
        this.isLoading = false;
        this.ministradas = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IMinistrada): number {
    return item.id!;
  }

  delete(ministrada: IMinistrada): void {
    const modalRef = this.modalService.open(MinistradaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.ministrada = ministrada;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
