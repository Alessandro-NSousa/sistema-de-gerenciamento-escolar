import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TelefoneComponent } from './list/telefone.component';
import { TelefoneDetailComponent } from './detail/telefone-detail.component';
import { TelefoneUpdateComponent } from './update/telefone-update.component';
import { TelefoneDeleteDialogComponent } from './delete/telefone-delete-dialog.component';
import { TelefoneRoutingModule } from './route/telefone-routing.module';

@NgModule({
  imports: [SharedModule, TelefoneRoutingModule],
  declarations: [TelefoneComponent, TelefoneDetailComponent, TelefoneUpdateComponent, TelefoneDeleteDialogComponent],
  entryComponents: [TelefoneDeleteDialogComponent],
})
export class TelefoneModule {}
