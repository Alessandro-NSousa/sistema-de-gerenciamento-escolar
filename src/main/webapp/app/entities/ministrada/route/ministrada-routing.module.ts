import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { MinistradaComponent } from '../list/ministrada.component';
import { MinistradaDetailComponent } from '../detail/ministrada-detail.component';
import { MinistradaUpdateComponent } from '../update/ministrada-update.component';
import { MinistradaRoutingResolveService } from './ministrada-routing-resolve.service';

const ministradaRoute: Routes = [
  {
    path: '',
    component: MinistradaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: MinistradaDetailComponent,
    resolve: {
      ministrada: MinistradaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: MinistradaUpdateComponent,
    resolve: {
      ministrada: MinistradaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: MinistradaUpdateComponent,
    resolve: {
      ministrada: MinistradaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ministradaRoute)],
  exports: [RouterModule],
})
export class MinistradaRoutingModule {}
