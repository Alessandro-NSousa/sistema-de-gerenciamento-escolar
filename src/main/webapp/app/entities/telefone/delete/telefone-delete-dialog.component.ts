import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITelefone } from '../telefone.model';
import { TelefoneService } from '../service/telefone.service';

@Component({
  templateUrl: './telefone-delete-dialog.component.html',
})
export class TelefoneDeleteDialogComponent {
  telefone?: ITelefone;

  constructor(protected telefoneService: TelefoneService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.telefoneService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
