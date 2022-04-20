import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { MinistradaComponent } from './list/ministrada.component';
import { MinistradaDetailComponent } from './detail/ministrada-detail.component';
import { MinistradaUpdateComponent } from './update/ministrada-update.component';
import { MinistradaDeleteDialogComponent } from './delete/ministrada-delete-dialog.component';
import { MinistradaRoutingModule } from './route/ministrada-routing.module';

@NgModule({
  imports: [SharedModule, MinistradaRoutingModule],
  declarations: [MinistradaComponent, MinistradaDetailComponent, MinistradaUpdateComponent, MinistradaDeleteDialogComponent],
  entryComponents: [MinistradaDeleteDialogComponent],
})
export class MinistradaModule {}
