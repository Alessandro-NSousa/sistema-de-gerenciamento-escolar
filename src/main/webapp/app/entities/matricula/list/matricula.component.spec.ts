import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MatriculaService } from '../service/matricula.service';

import { MatriculaComponent } from './matricula.component';

describe('Matricula Management Component', () => {
  let comp: MatriculaComponent;
  let fixture: ComponentFixture<MatriculaComponent>;
  let service: MatriculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MatriculaComponent],
    })
      .overrideTemplate(MatriculaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MatriculaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MatriculaService);

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
    expect(comp.matriculas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
