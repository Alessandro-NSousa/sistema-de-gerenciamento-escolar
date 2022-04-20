import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { MinistradaDetailComponent } from './ministrada-detail.component';

describe('Ministrada Management Detail Component', () => {
  let comp: MinistradaDetailComponent;
  let fixture: ComponentFixture<MinistradaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MinistradaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ ministrada: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(MinistradaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(MinistradaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load ministrada on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.ministrada).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
