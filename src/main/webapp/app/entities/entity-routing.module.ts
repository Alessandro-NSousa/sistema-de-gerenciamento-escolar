import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'discente',
        data: { pageTitle: 'sistemaEscolarApp.discente.home.title' },
        loadChildren: () => import('./discente/discente.module').then(m => m.DiscenteModule),
      },
      {
        path: 'docente',
        data: { pageTitle: 'sistemaEscolarApp.docente.home.title' },
        loadChildren: () => import('./docente/docente.module').then(m => m.DocenteModule),
      },
      {
        path: 'disciplina',
        data: { pageTitle: 'sistemaEscolarApp.disciplina.home.title' },
        loadChildren: () => import('./disciplina/disciplina.module').then(m => m.DisciplinaModule),
      },
      {
        path: 'matricula',
        data: { pageTitle: 'sistemaEscolarApp.matricula.home.title' },
        loadChildren: () => import('./matricula/matricula.module').then(m => m.MatriculaModule),
      },
      {
        path: 'ministrada',
        data: { pageTitle: 'sistemaEscolarApp.ministrada.home.title' },
        loadChildren: () => import('./ministrada/ministrada.module').then(m => m.MinistradaModule),
      },
      {
        path: 'endereco',
        data: { pageTitle: 'sistemaEscolarApp.endereco.home.title' },
        loadChildren: () => import('./endereco/endereco.module').then(m => m.EnderecoModule),
      },
      {
        path: 'telefone',
        data: { pageTitle: 'sistemaEscolarApp.telefone.home.title' },
        loadChildren: () => import('./telefone/telefone.module').then(m => m.TelefoneModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
