import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IDisciplina } from '../disciplina.model';
import { DisciplinaService } from '../service/disciplina.service';

@Component({
  templateUrl: './disciplina-delete-dialog.component.html',
})
export class DisciplinaDeleteDialogComponent {
  disciplina?: IDisciplina;

  constructor(protected disciplinaService: DisciplinaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.disciplinaService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
