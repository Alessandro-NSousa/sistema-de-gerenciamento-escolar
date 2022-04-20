import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DiscenteComponent } from '../list/discente.component';
import { DiscenteDetailComponent } from '../detail/discente-detail.component';
import { DiscenteUpdateComponent } from '../update/discente-update.component';
import { DiscenteRoutingResolveService } from './discente-routing-resolve.service';

const discenteRoute: Routes = [
  {
    path: '',
    component: DiscenteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DiscenteDetailComponent,
    resolve: {
      discente: DiscenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DiscenteUpdateComponent,
    resolve: {
      discente: DiscenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DiscenteUpdateComponent,
    resolve: {
      discente: DiscenteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(discenteRoute)],
  exports: [RouterModule],
})
export class DiscenteRoutingModule {}
