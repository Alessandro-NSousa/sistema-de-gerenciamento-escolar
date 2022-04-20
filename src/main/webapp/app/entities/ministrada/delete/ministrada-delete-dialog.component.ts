import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IMinistrada } from '../ministrada.model';
import { MinistradaService } from '../service/ministrada.service';

@Component({
  templateUrl: './ministrada-delete-dialog.component.html',
})
export class MinistradaDeleteDialogComponent {
  ministrada?: IMinistrada;

  constructor(protected ministradaService: MinistradaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ministradaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
