import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDiscente } from '../discente.model';

@Component({
  selector: 'jhi-discente-detail',
  templateUrl: './discente-detail.component.html',
})
export class DiscenteDetailComponent implements OnInit {
  discente: IDiscente | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ discente }) => {
      this.discente = discente;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
