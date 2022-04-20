import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { DiscenteService } from '../service/discente.service';

import { DiscenteComponent } from './discente.component';

describe('Discente Management Component', () => {
  let comp: DiscenteComponent;
  let fixture: ComponentFixture<DiscenteComponent>;
  let service: DiscenteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [DiscenteComponent],
    })
      .overrideTemplate(DiscenteComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(DiscenteComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(DiscenteService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.discentes?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
