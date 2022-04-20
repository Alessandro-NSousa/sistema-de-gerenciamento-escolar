import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { DiscenteComponent } from './list/discente.component';
import { DiscenteDetailComponent } from './detail/discente-detail.component';
import { DiscenteUpdateComponent } from './update/discente-update.component';
import { DiscenteDeleteDialogComponent } from './delete/discente-delete-dialog.component';
import { DiscenteRoutingModule } from './route/discente-routing.module';

@NgModule({
  imports: [SharedModule, DiscenteRoutingModule],
  declarations: [DiscenteComponent, DiscenteDetailComponent, DiscenteUpdateComponent, DiscenteDeleteDialogComponent],
  entryComponents: [DiscenteDeleteDialogComponent],
})
export class DiscenteModule {}
