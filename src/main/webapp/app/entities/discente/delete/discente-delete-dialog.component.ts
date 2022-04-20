import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDiscente } from '../discente.model';
import { DiscenteService } from '../service/discente.service';

@Component({
  templateUrl: './discente-delete-dialog.component.html',
})
export class DiscenteDeleteDialogComponent {
  discente?: IDiscente;

  constructor(protected discenteService: DiscenteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.discenteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
