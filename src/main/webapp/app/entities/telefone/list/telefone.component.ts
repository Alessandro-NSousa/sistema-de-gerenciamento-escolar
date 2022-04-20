import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITelefone } from '../telefone.model';
import { TelefoneService } from '../service/telefone.service';
import { TelefoneDeleteDialogComponent } from '../delete/telefone-delete-dialog.component';

@Component({
  selector: 'jhi-telefone',
  templateUrl: './telefone.component.html',
})
export class TelefoneComponent implements OnInit {
  telefones?: ITelefone[];
  isLoading = false;

  constructor(protected telefoneService: TelefoneService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.telefoneService.query().subscribe({
      next: (res: HttpResponse<ITelefone[]>) => {
        this.isLoading = false;
        this.telefones = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ITelefone): number {
    return item.id!;
  }

  delete(telefone: ITelefone): void {
    const modalRef = this.modalService.open(TelefoneDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.telefone = telefone;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
