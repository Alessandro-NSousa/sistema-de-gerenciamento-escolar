import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DisciplinaComponent } from '../list/disciplina.component';
import { DisciplinaDetailComponent } from '../detail/disciplina-detail.component';
import { DisciplinaUpdateComponent } from '../update/disciplina-update.component';
import { DisciplinaRoutingResolveService } from './disciplina-routing-resolve.service';

const disciplinaRoute: Routes = [
  {
    path: '',
    component: DisciplinaComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DisciplinaDetailComponent,
    resolve: {
      disciplina: DisciplinaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DisciplinaUpdateComponent,
    resolve: {
      disciplina: DisciplinaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DisciplinaUpdateComponent,
    resolve: {
      disciplina: DisciplinaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(disciplinaRoute)],
  exports: [RouterModule],
})
export class DisciplinaRoutingModule {}
