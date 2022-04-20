import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IMinistrada } from '../ministrada.model';

@Component({
  selector: 'jhi-ministrada-detail',
  templateUrl: './ministrada-detail.component.html',
})
export class MinistradaDetailComponent implements OnInit {
  ministrada: IMinistrada | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ ministrada }) => {
      this.ministrada = ministrada;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
