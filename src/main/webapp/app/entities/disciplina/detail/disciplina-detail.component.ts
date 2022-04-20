import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDisciplina } from '../disciplina.model';

@Component({
  selector: 'jhi-disciplina-detail',
  templateUrl: './disciplina-detail.component.html',
})
export class DisciplinaDetailComponent implements OnInit {
  disciplina: IDisciplina | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ disciplina }) => {
      this.disciplina = disciplina;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
