import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DisciplinaComponent } from './list/disciplina.component';
import { DisciplinaDetailComponent } from './detail/disciplina-detail.component';
import { DisciplinaUpdateComponent } from './update/disciplina-update.component';
import { DisciplinaDeleteDialogComponent } from './delete/disciplina-delete-dialog.component';
import { DisciplinaRoutingModule } from './route/disciplina-routing.module';

@NgModule({
  imports: [SharedModule, DisciplinaRoutingModule],
  declarations: [DisciplinaComponent, DisciplinaDetailComponent, DisciplinaUpdateComponent, DisciplinaDeleteDialogComponent],
  entryComponents: [DisciplinaDeleteDialogComponent],
})
export class DisciplinaModule {}
