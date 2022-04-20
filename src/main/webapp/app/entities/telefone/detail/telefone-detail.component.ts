import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ITelefone } from '../telefone.model';

@Component({
  selector: 'jhi-telefone-detail',
  templateUrl: './telefone-detail.component.html',
})
export class TelefoneDetailComponent implements OnInit {
  telefone: ITelefone | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ telefone }) => {
      this.telefone = telefone;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
