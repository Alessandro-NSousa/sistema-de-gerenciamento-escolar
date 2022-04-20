import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TelefoneService } from '../service/telefone.service';

import { TelefoneComponent } from './telefone.component';

describe('Telefone Management Component', () => {
  let comp: TelefoneComponent;
  let fixture: ComponentFixture<TelefoneComponent>;
  let service: TelefoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TelefoneComponent],
    })
      .overrideTemplate(TelefoneComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(TelefoneComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(TelefoneService);

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
    expect(comp.telefones?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
