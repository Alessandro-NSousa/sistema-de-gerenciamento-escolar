import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { MinistradaService } from '../service/ministrada.service';

import { MinistradaComponent } from './ministrada.component';

describe('Ministrada Management Component', () => {
  let comp: MinistradaComponent;
  let fixture: ComponentFixture<MinistradaComponent>;
  let service: MinistradaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [MinistradaComponent],
    })
      .overrideTemplate(MinistradaComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(MinistradaComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(MinistradaService);

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
    expect(comp.ministradas?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
