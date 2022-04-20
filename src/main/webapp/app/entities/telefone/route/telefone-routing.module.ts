import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TelefoneComponent } from '../list/telefone.component';
import { TelefoneDetailComponent } from '../detail/telefone-detail.component';
import { TelefoneUpdateComponent } from '../update/telefone-update.component';
import { TelefoneRoutingResolveService } from './telefone-routing-resolve.service';

const telefoneRoute: Routes = [
  {
    path: '',
    component: TelefoneComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TelefoneDetailComponent,
    resolve: {
      telefone: TelefoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TelefoneUpdateComponent,
    resolve: {
      telefone: TelefoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TelefoneUpdateComponent,
    resolve: {
      telefone: TelefoneRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(telefoneRoute)],
  exports: [RouterModule],
})
export class TelefoneRoutingModule {}
